const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''

export interface YouTubeResult {
  title: string
  channelTitle: string
  videoId: string
  url: string
  description: string
  publishedAt: string
  thumbnailUrl: string
  duration?: string
}

// Trusted educational channels - prioritize these
const TRUSTED_CHANNEL_IDS: Record<string, string> = {
  'khan academy': 'UC4a-Gbdw7vOaccHmFo40b9g',
  'mit opencourseware': 'UCEBb1b_L6zDS3xTUrIALZOw',
  '3blue1brown': 'UCYO_jab_esuFRV4b17AJtAg',
  'crashcourse': 'UCX6b17PVsYBQ0ip5gyeme-Q',
  'nptel': 'UCdmfOT9yjvGMGaLgBAkMFAA',
  'veritasium': 'UCHnyfMqiRRG1u-2MsSQLbXA',
  'physics wallah': 'UCAM5QWkSb_DGxlTwMcBCo-A',
  'ted': 'UCAuUUnT6oDeKwE6v1NGQxug',
  'computerphile': 'UC9-y-6csu5WGm29I7JiwpnA',
  'fireship': 'UCsBjURrPoezykLs9EqgamOA',
  'osmosis': 'UCNI0qOojpkhsUtaQ4_2NUhQ',
  'ninja nerd': 'UC6QYFutt9cluQ3uSM963_KQ',
}

export async function scrapeYouTube(
  topic: string,
  maxResults = 6,
  priorityChannels?: string[]
): Promise<YouTubeResult[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('[youtube] No API key set')
    return []
  }

  try {
    const results: YouTubeResult[] = []

    // First: search with educational filter
    const educationalQuery = encodeURIComponent(`${topic} tutorial lecture explained`)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${educationalQuery}&type=video&videoCategoryId=27&maxResults=${maxResults}&relevanceLanguage=en&key=${YOUTUBE_API_KEY}&order=relevance`

    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) {
      console.error('[youtube] Search failed:', await res.text())
      return []
    }

    const data = await res.json()
    const items = data.items || []

    // Score and sort - prioritize trusted channels
    const scored = items.map((item: any) => {
      const channelName = item.snippet.channelTitle.toLowerCase()
      const isTrusted = Object.keys(TRUSTED_CHANNEL_IDS).some(c => channelName.includes(c))
      const isPriority = priorityChannels?.some(c => channelName.includes(c.toLowerCase()))

      return {
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        videoId: item.id.videoId,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        description: item.snippet.description?.substring(0, 200) || '',
        publishedAt: item.snippet.publishedAt?.substring(0, 10) || '',
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || '',
        _score: (isPriority ? 3 : 0) + (isTrusted ? 2 : 0)
      }
    })

    scored.sort((a: any, b: any) => b._score - a._score)

    return scored.slice(0, maxResults).map(({ _score, ...r }: any) => r)

  } catch (e) {
    console.error('[youtube]', e)
    return []
  }
}