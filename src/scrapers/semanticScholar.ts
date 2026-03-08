export interface SemanticScholarResult {
  title: string
  authors: string[]
  abstract: string
  url: string
  year: number
  citationCount: number
  openAccessPdfUrl: string | null
  fieldsOfStudy: string[]
}

export async function scrapeSemanticScholar(topic: string, maxResults = 5): Promise<SemanticScholarResult[]> {
  try {
    const query = encodeURIComponent(topic)
    const fields = 'title,authors,abstract,year,citationCount,openAccessPdf,fieldsOfStudy,externalIds'
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=${maxResults}&fields=${fields}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Assign-LMS/1.0 (educational platform; contact@buildassign.com)'
      },
      signal: AbortSignal.timeout(15000)
    })

    if (!res.ok) return []
    const data = await res.json()

    return (data.data || [])
      .filter((p: any) => p.title && p.abstract)
      .map((p: any) => ({
        title: p.title,
        authors: (p.authors || []).slice(0, 3).map((a: any) => a.name),
        abstract: (p.abstract || '').substring(0, 400),
        url: `https://www.semanticscholar.org/paper/${p.paperId}`,
        year: p.year || 0,
        citationCount: p.citationCount || 0,
        openAccessPdfUrl: p.openAccessPdf?.url || null,
        fieldsOfStudy: p.fieldsOfStudy || []
      }))
      .sort((a: SemanticScholarResult, b: SemanticScholarResult) => b.citationCount - a.citationCount)

  } catch (e) {
    console.error('[semantic-scholar]', e)
    return []
  }
}