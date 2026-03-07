import axios from 'axios'

export interface DevDocsResult {
  docset: string
  entries: { name: string; path: string; type: string }[]
  topicsFound: string[]
}

export async function scrapeDevDocs(topic: string): Promise<DevDocsResult | null> {
  try {
    // get available docsets
    const docsetsRes = await axios.get('https://devdocs.io/docs/docs.json', {
      timeout: 5000
    })

    const docsets: { name: string; slug: string }[] = docsetsRes.data

    // find matching docset
    const topicLower = topic.toLowerCase()
    const match = docsets.find(d =>
      topicLower.includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(topicLower) ||
      topicLower.includes(d.slug.toLowerCase())
    )

    if (!match) return null

    // get entries for that docset
    const entriesRes = await axios.get(`https://devdocs.io/docs/${match.slug}/index.json`, {
      timeout: 5000
    })

    const entries = (entriesRes.data.entries || []).slice(0, 20).map((e: { name: string; path: string; type: string }) => ({
      name: e.name,
      path: e.path,
      type: e.type
    }))

    const topicsFound = entries.map((e: { name: string }) => e.name)

    return { docset: match.name, entries, topicsFound }
  } catch (e) {
    console.warn('[devdocs] failed:', (e as Error).message)
    return null
  }
}
