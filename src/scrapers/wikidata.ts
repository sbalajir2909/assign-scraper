import axios from 'axios'
import { WikidataResult } from '../types'

const WD = 'https://www.wikidata.org/w/api.php'
const HEADERS = { 'User-Agent': 'assign-scraper/1.0 (educational tool; https://github.com/sbalajir2909/assign)' }

export async function scrapeWikidata(topic: string): Promise<WikidataResult | null> {
  try {
    const searchRes = await axios.get(WD, {
      params: { action: 'wbsearchentities', search: topic, language: 'en', limit: 1, format: 'json' },
      timeout: 6000,
      headers: HEADERS
    })

    const entity = searchRes.data.search?.[0]
    if (!entity) return null
    const entityId = entity.id

    const entityRes = await axios.get(WD, {
      params: { action: 'wbgetentities', ids: entityId, languages: 'en', props: 'claims', format: 'json' },
      timeout: 6000,
      headers: HEADERS
    })

    const claims = entityRes.data.entities?.[entityId]?.claims || {}
    const broaderIds = extractIds(claims['P279'] || [], 5)
    const narrowerIds = extractIds(claims['P527'] || [], 8)

    const [broader, narrower] = await Promise.all([
      resolveLabels(broaderIds),
      resolveLabels(narrowerIds)
    ])

    return {
      conceptGraph: [
        ...broader.map(label => ({ id: entityId, label, relation: 'broader' })),
        ...narrower.map(label => ({ id: entityId, label, relation: 'narrower' })),
      ],
      prereqs: broader,
      broader,
      narrower
    }
  } catch (e) {
    console.warn('[wikidata] failed:', (e as Error).message)
    return null
  }
}

function extractIds(claims: {mainsnak?: {datavalue?: {value?: {id?: string}}}}[], limit: number): string[] {
  return claims
    .slice(0, limit)
    .map(c => c?.mainsnak?.datavalue?.value?.id)
    .filter((id): id is string => !!id)
}

async function resolveLabels(ids: string[]): Promise<string[]> {
  if (!ids.length) return []
  try {
    const res = await axios.get(WD, {
      params: { action: 'wbgetentities', ids: ids.join('|'), languages: 'en', props: 'labels', format: 'json' },
      timeout: 5000,
      headers: HEADERS
    })
    return Object.values(res.data.entities || {})
      .map((e: unknown) => (e as {labels?: {en?: {value?: string}}}).labels?.en?.value || '')
      .filter(Boolean) as string[]
  } catch {
    return []
  }
}
