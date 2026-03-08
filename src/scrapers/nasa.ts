const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'

export interface NasaResult {
  title: string
  authors: string[]
  abstract: string
  url: string
  reportNumber: string
  published: string
  center: string
}

export async function scrapeNasa(topic: string, maxResults = 5): Promise<NasaResult[]> {
  try {
    const query = encodeURIComponent(topic)
    const url = `https://ntrs.nasa.gov/api/citations/search?keyword=${query}&rows=${maxResults}&api_key=${NASA_API_KEY}`

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) return []

    const data = await res.json()
    const results = data.results || data.hits?.hits || []

    return results.slice(0, maxResults).map((r: any) => {
      const doc = r._source || r
      return {
        title: doc.title || '',
        authors: (doc.authors || []).slice(0, 3).map((a: any) => a.name || a),
        abstract: (doc.abstract || '').substring(0, 400),
        url: `https://ntrs.nasa.gov/citations/${doc.id || r._id}`,
        reportNumber: doc.reportNumber || doc.id || '',
        published: doc.publicationDate?.substring(0, 10) || '',
        center: doc.center?.name || doc.stiTypeDetails || ''
      }
    }).filter((r: NasaResult) => r.title)

  } catch (e) {
    console.error('[nasa]', e)
    return []
  }
}