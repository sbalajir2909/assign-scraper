import { scrapeArxiv, ArxivResult } from '../scrapers/arxiv'
import { scrapeSemanticScholar, SemanticScholarResult } from '../scrapers/semanticScholar'
import { scrapePubMed, PubMedResult } from '../scrapers/pubmed'
import { scrapeNasa, NasaResult } from '../scrapers/nasa'
import { scrapeYouTube, YouTubeResult } from '../scrapers/youtube'
import { findNcertResources, NcertResult } from '../scrapers/ncert'
import { findOpenStaxBooks, OpenStaxResult } from '../scrapers/openStax'
import { findExamResources, ExamResource } from '../scrapers/examSources'
import { classifyDomain } from '../classifiers/domainClassifier'

export interface ResourcePack {
  conceptTitle: string
  papers: {
    title: string
    authors: string[]
    abstract: string
    url: string
    pdfUrl?: string
    source: string
    year?: string | number
    citationCount?: number
  }[]
  videos: {
    title: string
    channel: string
    url: string
    description: string
    thumbnailUrl: string
  }[]
  textbooks: {
    title: string
    url: string
    pdfUrl?: string
    description: string
    source: string
    type: string
  }[]
  examResources: {
    name: string
    url: string
    description: string
    examBoard: string
    type: string
  }[]
  officialDocs: {
    name: string
    url: string
    description: string
  }[]
}

export async function generateResourcePack(
  conceptTitle: string,
  topicContext: string
): Promise<ResourcePack> {
  const searchTerm = `${conceptTitle} ${topicContext}`.trim()
  const { domain, sources } = classifyDomain(searchTerm)

  console.log(`[resources] Building pack for "${conceptTitle}" | domain: ${domain}`)

  // Run all relevant scrapers in parallel
  const [
    arxivResults,
    semanticResults,
    pubmedResults,
    nasaResults,
    youtubeResults,
  ] = await Promise.allSettled([
    sources.useArxiv ? scrapeArxiv(conceptTitle, 4) : Promise.resolve([]),
    sources.useSemanticScholar ? scrapeSemanticScholar(conceptTitle, 4) : Promise.resolve([]),
    sources.usePubmed ? scrapePubMed(conceptTitle, 3) : Promise.resolve([]),
    sources.useNasa ? scrapeNasa(conceptTitle, 3) : Promise.resolve([]),
    sources.useYoutube ? scrapeYouTube(conceptTitle, 5, sources.youtubeChannels) : Promise.resolve([]),
  ])

  const arxiv = (arxivResults.status === 'fulfilled' ? arxivResults.value : []) as ArxivResult[]
  const semantic = (semanticResults.status === 'fulfilled' ? semanticResults.value : []) as SemanticScholarResult[]
  const pubmed = (pubmedResults.status === 'fulfilled' ? pubmedResults.value : []) as PubMedResult[]
  const nasa = (nasaResults.status === 'fulfilled' ? nasaResults.value : []) as NasaResult[]
  const videos = (youtubeResults.status === 'fulfilled' ? youtubeResults.value : []) as YouTubeResult[]

  const ncertBooks = sources.useNcert ? findNcertResources(searchTerm) : []
  const openStaxBooks = sources.useOpenStax ? findOpenStaxBooks(searchTerm) : []
  const examResources = sources.useExamSources ? findExamResources(searchTerm) : []

  // Merge papers - deduplicate by title similarity
  const papers: ResourcePack['papers'] = []
  const seenTitles = new Set<string>()

  const addPaper = (title: string, authors: string[], abstract: string, url: string, source: string, pdfUrl?: string, year?: string | number, citations?: number) => {
    const key = title.toLowerCase().substring(0, 50)
    if (!seenTitles.has(key) && title && abstract) {
      seenTitles.add(key)
      papers.push({ title, authors, abstract, url, pdfUrl, source, year, citationCount: citations })
    }
  }

  // Prioritize highly cited semantic scholar results
  semantic
    .sort((a, b) => b.citationCount - a.citationCount)
    .slice(0, 3)
    .forEach(p => addPaper(p.title, p.authors, p.abstract, p.url, 'Semantic Scholar', p.openAccessPdfUrl || undefined, p.year, p.citationCount))

  arxiv.slice(0, 3).forEach(p => addPaper(p.title, p.authors, p.abstract, p.url, 'ArXiv', p.pdfUrl, p.published))
  pubmed.slice(0, 2).forEach(p => addPaper(p.title, p.authors, p.abstract, p.url, 'PubMed', undefined, p.published))
  nasa.slice(0, 2).forEach(p => addPaper(p.title, p.authors, p.abstract, p.url, 'NASA', undefined, p.published))

  // Merge textbooks
  const textbooks: ResourcePack['textbooks'] = []
  ncertBooks.forEach(b => textbooks.push({ title: b.title, url: b.url, pdfUrl: b.pdfUrl, description: `NCERT Class ${b.class} - ${b.subject}`, source: 'NCERT', type: 'textbook' }))
  openStaxBooks.forEach(b => textbooks.push({ title: b.title, url: b.url, pdfUrl: b.pdfUrl, description: b.description, source: 'OpenStax', type: 'textbook' }))

  return {
    conceptTitle,
    papers: papers.slice(0, 6),
    videos: videos.slice(0, 5).map(v => ({
      title: v.title,
      channel: v.channelTitle,
      url: v.url,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl
    })),
    textbooks: textbooks.slice(0, 4),
    examResources: examResources.slice(0, 5).map(r => ({
      name: r.name,
      url: r.url,
      description: r.description,
      examBoard: r.examBoard,
      type: r.type
    })),
    officialDocs: (sources.officialSites || []).map(site => ({
      name: site,
      url: `https://${site}`,
      description: `Official resource: ${site}`
    }))
  }
}