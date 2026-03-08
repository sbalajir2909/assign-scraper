export interface ArxivResult {
  title: string
  authors: string[]
  abstract: string
  url: string
  pdfUrl: string
  published: string
  categories: string[]
  relevanceScore: number
}

export async function scrapeArxiv(topic: string, maxResults = 5): Promise<ArxivResult[]> {
  try {
    const query = encodeURIComponent(topic.replace(/\s+/g, '+'))
    const url = `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Assign-LMS/1.0 (educational platform; contact@buildassign.com)' },
      signal: AbortSignal.timeout(15000)
    })

    if (!res.ok) return []
    const xml = await res.text()

    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []

    return entries.map((entry, i) => {
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim().replace(/\s+/g, ' ') || ''
      const abstract = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim().replace(/\s+/g, ' ') || ''
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1]?.substring(0, 10) || ''
      const arxivId = entry.match(/<id>(.*?)<\/id>/)?.[1]?.split('/abs/')?.[1] || ''

      const authorMatches = entry.matchAll(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g)
      const authors = [...authorMatches].map(m => m[1]).slice(0, 3)

      const catMatches = entry.matchAll(/term="([^"]+)"/g)
      const categories = [...catMatches].map(m => m[1]).slice(0, 3)

      return {
        title,
        authors,
        abstract: abstract.substring(0, 400),
        url: `https://arxiv.org/abs/${arxivId}`,
        pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
        published,
        categories,
        relevanceScore: maxResults - i
      }
    }).filter(r => r.title && r.abstract)

  } catch (e) {
    console.error('[arxiv]', e)
    return []
  }
}