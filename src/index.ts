import express from 'express'
import cors from 'cors'
import { scrapeWikipedia } from './scrapers/wikipedia'
import { scrapeWikidata } from './scrapers/wikidata'
import { scrapeOpenAlex } from './scrapers/openAlex'
import { scrapeStackOverflow } from './scrapers/stackOverflow'
import { scrapeGitHub } from './scrapers/github'
import { scrapeNpm } from './scrapers/npm'
import { scrapeDevDocs } from './scrapers/devdocs'
import { scrapeArxiv } from './scrapers/arxiv'
import { scrapeSemanticScholar } from './scrapers/semanticScholar'
import { scrapePubMed } from './scrapers/pubmed'
import { scrapeNasa } from './scrapers/nasa'
import { scrapeYouTube } from './scrapers/youtube'
import { findNcertResources } from './scrapers/ncert'
import { findOpenStaxBooks } from './scrapers/openStax'
import { findExamResources } from './scrapers/examSources'
import { classifyDomain } from './classifiers/domainClassifier'
import { generateResourcePack } from './generators/resourcePack'

const app = express()
app.use(cors())
app.use(express.json())

// ── Health ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    scrapers: ['wikipedia', 'wikidata', 'openAlex', 'stackOverflow', 'github', 'npm', 'devdocs', 'arxiv', 'semanticScholar', 'pubmed', 'nasa', 'youtube', 'ncert', 'openStax', 'examSources'],
    version: '2.0.0'
  })
})

// ── Is dev tool helper ───────────────────────────────────────────────────
function isDevTool(topic: string): boolean {
  const devKeywords = ['sdk', 'api', 'library', 'framework', 'package', 'npm', 'react', 'vue', 'angular', 'express', 'fastapi', 'django', 'rails', 'spring', 'tensorflow', 'pytorch', 'langchain', 'openai sdk', 'supabase', 'prisma', 'nextjs', 'tailwind']
  const lower = topic.toLowerCase()
  return devKeywords.some(k => lower.includes(k))
}

// ── /scrape — main context endpoint ─────────────────────────────────────
app.post('/scrape', async (req, res) => {
  const { topic } = req.body
  if (!topic) return res.status(400).json({ error: 'topic required' })

  console.log(`[scrape] topic="${topic}"`)

  const { domain, sources, subdomains } = classifyDomain(topic)
  console.log(`[scrape] domain=${domain} subdomains=${subdomains.join(',')}`)

  const isDev = isDevTool(topic)

  // Run scrapers in parallel based on domain
  const scraperPromises: Record<string, Promise<any>> = {
    wikidata: scrapeWikidata(topic),
    conceptNet: fetch(`https://api.conceptnet.io/c/en/${encodeURIComponent(topic.replace(/\s+/g, '_'))}?limit=10`)
      .then(r => r.json()).catch(() => null),
  }

  if (isDev) {
    scraperPromises.npm = scrapeNpm(topic)
    scraperPromises.devdocs = scrapeDevDocs(topic)
    scraperPromises.stackOverflow = scrapeStackOverflow(topic)
    scraperPromises.github = scrapeGitHub(topic)
  } else {
    scraperPromises.wikipedia = scrapeWikipedia(topic)
  }

  if (sources.useArxiv) scraperPromises.arxiv = scrapeArxiv(topic, 3)
  if (sources.useSemanticScholar) scraperPromises.semanticScholar = scrapeSemanticScholar(topic, 3)
  if (sources.usePubmed) scraperPromises.pubmed = scrapePubMed(topic, 2)
  if (sources.useNasa) scraperPromises.nasa = scrapeNasa(topic, 2)
  if (sources.useOpenStax) scraperPromises.openStax = Promise.resolve(findOpenStaxBooks(topic))
  if (sources.useNcert) scraperPromises.ncert = Promise.resolve(findNcertResources(topic))
  if (sources.useExamSources) scraperPromises.examSources = Promise.resolve(findExamResources(topic))

  const settled = await Promise.allSettled(
    Object.entries(scraperPromises).map(async ([key, promise]) => {
      const result = await promise
      return { key, result }
    })
  )

  const context: Record<string, any> = {}
  const sourcesHit: string[] = []

  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value.result) {
      const { key, result } = s.value
      const hasData = Array.isArray(result) ? result.length > 0 : !!result
      if (hasData) {
        context[key] = result
        sourcesHit.push(key)
      }
    }
  }

  console.log(`[scrape] sources hit: ${sourcesHit.join(', ')}`)

  // Synthesize context for LLM
  const synthesized = synthesizeContext(topic, context, domain)

  res.json({
    topic,
    domain,
    subdomains,
    sourcesHit,
    context: synthesized,
    raw: context
  })
})

// ── /resources — post-mastery resource pack ──────────────────────────────
app.post('/resources', async (req, res) => {
  const { conceptTitle, topicContext } = req.body
  if (!conceptTitle) return res.status(400).json({ error: 'conceptTitle required' })

  console.log(`[resources] building pack for "${conceptTitle}"`)

  try {
    const pack = await generateResourcePack(conceptTitle, topicContext || conceptTitle)
    res.json({ pack })
  } catch (e) {
    console.error('[resources]', e)
    res.status(500).json({ error: 'Failed to generate resource pack' })
  }
})

// ── Synthesizer ───────────────────────────────────────────────────────────
function synthesizeContext(topic: string, ctx: Record<string, any>, domain: string): string {
  const parts: string[] = [`TOPIC: ${topic}`, `DOMAIN: ${domain}`, '']

  // Wikipedia/Wikidata
  if (ctx.wikidata) {
    const w = ctx.wikidata
    if (w.description) parts.push(`DEFINITION: ${w.description}`)
    if (w.aliases?.length) parts.push(`ALSO KNOWN AS: ${w.aliases.slice(0, 3).join(', ')}`)
    if (w.properties) {
      const props = Object.entries(w.properties).slice(0, 5).map(([k, v]) => `${k}: ${v}`).join('; ')
      if (props) parts.push(`KEY FACTS: ${props}`)
    }
    parts.push('')
  }

  if (ctx.wikipedia) {
    parts.push(`OVERVIEW: ${String(ctx.wikipedia).substring(0, 500)}`)
    parts.push('')
  }

  // Academic papers
  const papers = [
    ...(ctx.arxiv || []).slice(0, 2),
    ...(ctx.semanticScholar || []).slice(0, 2),
    ...(ctx.pubmed || []).slice(0, 1),
    ...(ctx.nasa || []).slice(0, 1),
  ]

  if (papers.length > 0) {
    parts.push('ACADEMIC SOURCES:')
    papers.forEach((p: any) => {
      if (p.title && p.abstract) {
        parts.push(`• ${p.title}`)
        parts.push(`  ${p.abstract.substring(0, 200)}`)
      }
    })
    parts.push('')
  }

  // ConceptNet relationships
  if (ctx.conceptNet?.edges?.length) {
    const relations = ctx.conceptNet.edges
      .slice(0, 8)
      .map((e: any) => `${e.rel?.label || 'relates to'} ${e.end?.label || ''}`)
      .filter(Boolean)
    if (relations.length) {
      parts.push(`CONCEPT RELATIONSHIPS: ${relations.join(', ')}`)
      parts.push('')
    }
  }

  // Dev tools
  if (ctx.npm) {
    parts.push(`NPM PACKAGE: ${ctx.npm.description || ''}`)
    if (ctx.npm.keywords?.length) parts.push(`KEYWORDS: ${ctx.npm.keywords.slice(0, 8).join(', ')}`)
    if (ctx.npm.readme) parts.push(`README EXCERPT: ${String(ctx.npm.readme).substring(0, 400)}`)
    parts.push('')
  }

  if (ctx.devdocs) {
    parts.push(`OFFICIAL DOCS: ${ctx.devdocs.name || topic}`)
    if (ctx.devdocs.entries?.length) {
      const entries = ctx.devdocs.entries.slice(0, 5).map((e: any) => e.name).join(', ')
      parts.push(`KEY SECTIONS: ${entries}`)
    }
    parts.push('')
  }

  // Stack Overflow / GitHub
  if (ctx.stackOverflow?.length) {
    parts.push('COMMON QUESTIONS:')
    ctx.stackOverflow.slice(0, 3).forEach((q: any) => {
      parts.push(`• ${q.title || q.question || ''}`)
    })
    parts.push('')
  }

  if (ctx.github?.length) {
    parts.push('RELATED PROJECTS:')
    ctx.github.slice(0, 3).forEach((r: any) => {
      if (r.description) parts.push(`• ${r.full_name || r.name}: ${r.description}`)
    })
    parts.push('')
  }

  // Curriculum resources
  if (ctx.openStax?.length) {
    parts.push('FREE TEXTBOOKS:')
    ctx.openStax.forEach((b: any) => parts.push(`• ${b.title} — ${b.url}`))
    parts.push('')
  }

  if (ctx.ncert?.length) {
    parts.push('NCERT TEXTBOOKS:')
    ctx.ncert.forEach((b: any) => parts.push(`• ${b.title} — ${b.pdfUrl}`))
    parts.push('')
  }

  if (ctx.examSources?.length) {
    parts.push('OFFICIAL EXAM RESOURCES:')
    ctx.examSources.forEach((r: any) => parts.push(`• ${r.name} (${r.examBoard}) — ${r.url}`))
    parts.push('')
  }

  return parts.join('\n')
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`assign-scraper v2.0 running on port ${PORT}`))