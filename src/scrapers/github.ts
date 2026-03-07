import axios from 'axios'
import { GithubResult } from '../types'

export async function scrapeGithub(topic: string): Promise<GithubResult | null> {
  try {
    const slug = topic.toLowerCase().replace(/\s+/g, '-')

    // search for awesome list
    const awesomeRes = await axios.get('https://api.github.com/search/repositories', {
      params: { q: `awesome-${slug} in:name`, sort: 'stars', per_page: 1 },
      timeout: 5000,
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'assign-scraper/1.0' }
    })
    const awesomeRepo = awesomeRes.data.items?.[0]
    let awesomeList: string | null = null

    if (awesomeRepo) {
      try {
        const readmeRes = await axios.get(
          `https://api.github.com/repos/${awesomeRepo.full_name}/readme`,
          { headers: { 'Accept': 'application/vnd.github.v3.raw', 'User-Agent': 'assign-scraper/1.0' }, timeout: 5000 }
        )
        awesomeList = readmeRes.data?.slice(0, 3000) || null
      } catch { awesomeList = null }
    }

    // search for learning repos
    const reposRes = await axios.get('https://api.github.com/search/repositories', {
      params: { q: `learn ${topic} in:name,description`, sort: 'stars', per_page: 5 },
      timeout: 5000,
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'assign-scraper/1.0' }
    })

    const topRepos = (reposRes.data.items || []).map((r: { name: string; description: string }) => ({
      name: r.name,
      description: r.description || ''
    }))

    const learningResources = topRepos.map((r: { name: string }) => r.name)

    return { awesomeList, topRepos, learningResources }
  } catch {
    return null
  }
}
