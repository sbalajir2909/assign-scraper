import axios from 'axios'
import { WikipediaResult } from '../types'

const HEADERS = { 'User-Agent': 'assign-scraper/1.0 (educational tool)' }

export async function scrapeWikipedia(topic: string): Promise<WikipediaResult | null> {
  try {
    const slug = topic.trim().replace(/\s+/g, '_')

    const summaryRes = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      { timeout: 6000, headers: HEADERS }
    )
    const summary = summaryRes.data.extract || ''

    let sections: string[] = []
    try {
      const sectionsRes = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(slug)}`,
        { timeout: 6000, headers: HEADERS }
      )
      sections = (sectionsRes.data.remaining?.sections || [])
        .map((s: { line?: string }) => s.line || '')
        .filter((s: string) => s.length > 0 && !s.startsWith('<'))
        .slice(0, 12)
    } catch { sections = [] }

    let relatedTopics: string[] = []
    try {
      const relatedRes = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(slug)}`,
        { timeout: 6000, headers: HEADERS }
      )
      relatedTopics = (relatedRes.data.pages || [])
        .map((p: { title: string }) => p.title)
        .slice(0, 8)
    } catch { relatedTopics = [] }

    return {
      summary,
      sections,
      relatedTopics,
      url: `https://en.wikipedia.org/wiki/${slug}`
    }
  } catch (e) {
    console.warn('[wikipedia] failed:', (e as Error).message)
    return null
  }
}
