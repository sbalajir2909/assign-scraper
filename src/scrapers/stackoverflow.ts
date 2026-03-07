import axios from 'axios'
import { StackOverflowResult } from '../types'

export async function scrapeStackOverflow(topic: string): Promise<StackOverflowResult | null> {
  try {
    const res = await axios.get('https://api.stackexchange.com/2.3/search/advanced', {
      params: {
        order: 'desc',
        sort: 'votes',
        q: topic,
        site: 'stackoverflow',
        pagesize: 10,
        filter: 'default'
      },
      timeout: 5000
    })

    const questions = (res.data.items || []).map((q: { title: string; tags: string[] }) => ({
      title: q.title,
      tags: q.tags || []
    }))

    // extract pain points from question titles
    const painKeywords = ['why', 'how', 'difference', 'when to use', 'error', 'not working', 'confused', 'understand']
    const commonPainPoints = questions
      .filter((q: { title: string }) => painKeywords.some(k => q.title.toLowerCase().includes(k)))
      .map((q: { title: string }) => q.title)
      .slice(0, 5)

    return { topQuestions: questions.slice(0, 8), commonPainPoints }
  } catch {
    return null
  }
}
