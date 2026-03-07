import axios from 'axios'

export interface NpmResult {
  name: string
  description: string
  readme: string
  keywords: string[]
  repoUrl: string | null
}

export async function scrapeNpm(topic: string): Promise<NpmResult | null> {
  try {
    // search npm registry
    const searchRes = await axios.get('https://registry.npmjs.org/-/v1/search', {
      params: { text: topic, size: 1 },
      timeout: 5000
    })

    const pkg = searchRes.data.objects?.[0]?.package
    if (!pkg) return null

    // get full package info including readme
    const pkgRes = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`, {
      timeout: 5000
    })

    const readme = pkgRes.data.readme?.slice(0, 3000) || ''
    const repoUrl = pkgRes.data.repository?.url?.replace('git+', '').replace('.git', '') || null

    return {
      name: pkg.name,
      description: pkg.description || '',
      readme,
      keywords: pkg.keywords || [],
      repoUrl
    }
  } catch (e) {
    console.warn('[npm] failed:', (e as Error).message)
    return null
  }
}
