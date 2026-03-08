const PUBMED_API_KEY = process.env.PUBMED_API_KEY || ''

export interface PubMedResult {
  title: string
  authors: string[]
  abstract: string
  url: string
  pmid: string
  published: string
  journal: string
}

export async function scrapePubMed(topic: string, maxResults = 5): Promise<PubMedResult[]> {
  try {
    const query = encodeURIComponent(topic)
    const apiKey = PUBMED_API_KEY ? `&api_key=${PUBMED_API_KEY}` : ''

    // Step 1: search for IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmax=${maxResults}&retmode=json&sort=relevance${apiKey}`
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(15000) })
    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const ids: string[] = searchData.esearchresult?.idlist || []
    if (ids.length === 0) return []

    // Step 2: fetch abstracts
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml${apiKey}`
    const fetchRes = await fetch(fetchUrl, { signal: AbortSignal.timeout(15000) })
    if (!fetchRes.ok) return []

    const xml = await fetchRes.text()
    const articles = xml.match(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g) || []

    return articles.map(article => {
      const title = article.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
      const abstract = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/)?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
      const pmid = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] || ''
      const journal = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1]?.trim() || ''

      const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
      const month = article.match(/<PubDate>[\s\S]*?<Month>(\w+)<\/Month>/)?.[1] || ''

      const authorMatches = article.matchAll(/<Author[^>]*>[\s\S]*?<LastName>(.*?)<\/LastName>[\s\S]*?(?:<ForeName>(.*?)<\/ForeName>)?[\s\S]*?<\/Author>/g)
      const authors = [...authorMatches].slice(0, 3).map(m => `${m[2] || ''} ${m[1]}`.trim())

      return {
        title,
        authors,
        abstract: abstract.substring(0, 400),
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        pmid,
        published: `${month} ${year}`.trim(),
        journal
      }
    }).filter(r => r.title && r.pmid)

  } catch (e) {
    console.error('[pubmed]', e)
    return []
  }
}