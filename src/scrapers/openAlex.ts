import axios from 'axios'
import { OpenAlexResult } from '../types'

export async function scrapeOpenAlex(topic: string): Promise<OpenAlexResult | null> {
  try {
    const res = await axios.get('https://api.openalex.org/concepts', {
      params: {
        search: topic,
        per_page: 1,
        select: 'id,display_name,related_concepts,ancestors'
      },
      timeout: 5000,
      headers: { 'User-Agent': 'assign-scraper/1.0 (educational tool; mailto:assign@example.com)' }
    })

    const concept = res.data.results?.[0]
    if (!concept) return null

    const topConcepts = (concept.related_concepts || [])
      .slice(0, 8)
      .map((c: { display_name: string }) => c.display_name)

    const relatedFields = (concept.ancestors || [])
      .slice(0, 5)
      .map((a: { display_name: string }) => a.display_name)

    return {
      topConcepts,
      relatedFields,
      url: concept.id
    }
  } catch {
    return null
  }
}
