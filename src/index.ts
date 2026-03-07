import express from 'express'
import cors from 'cors'
import { scrapeWikipedia } from './scrapers/wikipedia'
import { scrapeWikidata } from './scrapers/wikidata'
import { scrapeOpenAlex } from './scrapers/openAlex'
import { scrapeStackOverflow } from './scrapers/stackoverflow'
import { scrapeGithub } from './scrapers/github'
import { synthesizeCourse } from './agents/synthesizer'
import { validateSchema } from './validators/schemaValidator'
import { validateMetadata } from './validators/metadataValidator'
import { LearnerProfile, ScrapedContext } from './types'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.post('/scrape', async (req, res) => {
  const profile: LearnerProfile = req.body

  if (!profile.topic || !profile.level || !profile.goal || !profile.time) {
    return res.status(400).json({ error: 'Missing learner profile fields' })
  }

  console.log(`[scrape] topic="${profile.topic}" level="${profile.level}" goal="${profile.goal}"`)

  // ── Run all scrapers in parallel ─────────────────────────────────────────
  const [wikipedia, wikidata, openAlex, stackOverflow, github] = await Promise.allSettled([
    scrapeWikipedia(profile.topic),
    scrapeWikidata(profile.topic),
    scrapeOpenAlex(profile.topic),
    scrapeStackOverflow(profile.topic),
    scrapeGithub(profile.topic)
  ])

  const context: ScrapedContext = {
    wikipedia: wikipedia.status === 'fulfilled' ? wikipedia.value : null,
    wikidata: wikidata.status === 'fulfilled' ? wikidata.value : null,
    openAlex: openAlex.status === 'fulfilled' ? openAlex.value : null,
    stackOverflow: stackOverflow.status === 'fulfilled' ? stackOverflow.value : null,
    github: github.status === 'fulfilled' ? github.value : null,
  }

  console.log(`[scrape] sources: wiki=${!!context.wikipedia} wikidata=${!!context.wikidata} openAlex=${!!context.openAlex} so=${!!context.stackOverflow} gh=${!!context.github}`)

  // ── Synthesize course ────────────────────────────────────────────────────
  const course = await synthesizeCourse(context, profile)
  if (!course) {
    return res.status(500).json({ error: 'Course synthesis failed' })
  }

  // ── Schema validation ────────────────────────────────────────────────────
  const schemaCheck = validateSchema(course)
  if (!schemaCheck.valid) {
    console.warn('[validate] Schema errors:', schemaCheck.errors)
    course.validationReport.errors.push(...schemaCheck.errors)
  }

  // ── Metadata validation + auto-fix ──────────────────────────────────────
  const scrapedTitles = [
    ...(context.wikidata?.narrower || []),
    ...(context.openAlex?.topConcepts || []),
    ...(context.wikipedia?.sections || [])
  ]
  const metaReport = validateMetadata(course, scrapedTitles)
  course.validationReport = {
    ...metaReport,
    sourcesCoverage: course.validationReport.sourcesCoverage
  }

  console.log(`[validate] passed=${metaReport.passed} fixes=${metaReport.autoFixed.length} warnings=${metaReport.warnings.length} errors=${metaReport.errors.length}`)

  return res.json({ course, context: { sourcesHit: Object.entries(context).filter(([, v]) => v !== null).map(([k]) => k) } })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`assign-scraper running on port ${PORT}`))
