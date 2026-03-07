import express from 'express'
import cors from 'cors'
import { scrapeWikipedia } from './scrapers/wikipedia'
import { scrapeWikidata } from './scrapers/wikidata'
import { scrapeOpenAlex } from './scrapers/openAlex'
import { scrapeStackOverflow } from './scrapers/stackoverflow'
import { scrapeGithub } from './scrapers/github'
import { scrapeNpm } from './scrapers/npm'
import { scrapeDevDocs } from './scrapers/devdocs'
import { synthesizeCourse } from './agents/synthesizer'
import { validateSchema } from './validators/schemaValidator'
import { validateMetadata } from './validators/metadataValidator'
import { LearnerProfile, ScrapedContext } from './types'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok' }))

// detect if topic looks like a dev tool / package
function isDevTool(topic: string): boolean {
  const devKeywords = ['sdk', 'api', 'framework', 'library', 'cli', 'npm', 'package', 'hook', 'router', 'orm', 'db', 'auth', 'react', 'vue', 'next', 'nuxt', 'express', 'fastapi', 'django', 'rails', 'prisma', 'supabase', 'firebase', 'tailwind', 'webpack', 'vite', 'babel', 'eslint', 'jest', 'cypress']
  const lower = topic.toLowerCase()
  return devKeywords.some(k => lower.includes(k))
}

app.post('/scrape', async (req, res) => {
  const profile: LearnerProfile = req.body

  if (!profile.topic || !profile.level || !profile.goal || !profile.time) {
    return res.status(400).json({ error: 'Missing learner profile fields' })
  }

  console.log(`[scrape] topic="${profile.topic}" level="${profile.level}" goal="${profile.goal}"`)

  const isTool = isDevTool(profile.topic)

  // run all scrapers in parallel — prioritize npm + devdocs for dev tools
  const [wikipedia, wikidata, openAlex, stackOverflow, github, npm, devdocs] = await Promise.allSettled([
    scrapeWikipedia(profile.topic),
    scrapeWikidata(profile.topic),
    isTool ? Promise.resolve(null) : scrapeOpenAlex(profile.topic), // skip for dev tools
    scrapeStackOverflow(profile.topic),
    scrapeGithub(profile.topic),
    isTool ? scrapeNpm(profile.topic) : Promise.resolve(null),
    isTool ? scrapeDevDocs(profile.topic) : Promise.resolve(null),
  ])

  const context: ScrapedContext = {
    wikipedia: wikipedia.status === 'fulfilled' ? wikipedia.value : null,
    wikidata: wikidata.status === 'fulfilled' ? wikidata.value : null,
    openAlex: openAlex.status === 'fulfilled' ? openAlex.value : null,
    stackOverflow: stackOverflow.status === 'fulfilled' ? stackOverflow.value : null,
    github: github.status === 'fulfilled' ? github.value : null,
    npm: npm.status === 'fulfilled' ? npm.value : null,
    devdocs: devdocs.status === 'fulfilled' ? devdocs.value : null,
  }

  const sourcesHit = Object.entries(context)
    .filter(([, v]) => v !== null)
    .map(([k]) => k)

  console.log(`[scrape] sources: ${sourcesHit.join(', ')}`)

  const course = await synthesizeCourse(context, profile)
  if (!course) {
    return res.status(500).json({ error: 'Course synthesis failed' })
  }

  // schema validation
  const schemaCheck = validateSchema(course)
  if (!schemaCheck.valid) {
    console.warn('[validate] Schema errors:', schemaCheck.errors)
    course.validationReport.errors.push(...schemaCheck.errors)
  }

  // metadata validation + auto-fix
  const scrapedTitles = [
    ...(context.wikidata?.narrower || []),
    ...(context.openAlex?.topConcepts || []),
    ...(context.wikipedia?.sections || []),
    ...(context.devdocs?.topicsFound || []),
  ]
  const metaReport = validateMetadata(course, scrapedTitles)
  course.validationReport = {
    ...metaReport,
    sourcesCoverage: {
      wikipedia: !!context.wikipedia,
      wikidata: !!context.wikidata,
      openAlex: !!context.openAlex,
      stackOverflow: !!context.stackOverflow,
      github: !!context.github,
      npm: !!context.npm,
      devdocs: !!context.devdocs,
    }
  }

  console.log(`[validate] passed=${metaReport.passed} fixes=${metaReport.autoFixed.length} warnings=${metaReport.warnings.length}`)

  return res.json({ course, context: { sourcesHit } })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`assign-scraper running on port ${PORT}`))
