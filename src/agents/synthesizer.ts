import axios from 'axios'
import { ScrapedContext, LearnerProfile, Course } from '../types'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYNTHESIZER_PROMPT = `You are a world-class curriculum designer. Build the best possible personalized course using real knowledge from multiple sources.

Respond ONLY with valid JSON in this exact shape, no text before or after:
{
  "gist": {
    "emphasis": "2-3 sentences on what this course emphasizes and why, specific to the learner's goal",
    "outcomes": [
      "Build a working X from scratch using Y",
      "Implement and debug Z in a real project",
      "Design and deploy A using B"
    ],
    "prereqs": ["Specific prereq 1"]
  },
  "concepts": [
    {
      "title": "Specific concept title (max 6 words, never generic like Introduction or Basics)",
      "description": "2-3 sentences minimum explaining what this concept is and why it matters",
      "why": "One sentence: why this specific concept matters for the learner's exact goal",
      "subtopics": ["subtopic 1", "subtopic 2", "subtopic 3"],
      "estimatedMinutes": 20,
      "prereq": null,
      "sources": ["Wikipedia", "npm"]
    }
  ]
}

CRITICAL RULES:
- outcomes MUST be full sentences starting with action verbs — never single words
- concept titles MUST be specific — never: Introduction, Basics, Overview, Fundamentals, Getting Started
- estimatedMinutes: 10-45 per concept
- prereq: exact title of a previous concept or null — never an array
- 5-8 concepts ordered foundational to advanced
- if npm/devdocs data is present, use it heavily — it's the most accurate source for dev tools
- if devdocs entries are present, use them as concept titles and subtopics
- prereqs in gist: only external knowledge needed before starting`

export async function synthesizeCourse(context: ScrapedContext, profile: LearnerProfile): Promise<Course | null> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set')

  const contextSummary = buildContextSummary(context)

  const prompt = `Learner profile:
- Topic: ${profile.topic}
- Current level: ${profile.level}
- Goal: ${profile.goal}
- Available time: ${profile.time}

Real knowledge from multiple sources:
${contextSummary}

Build the best possible course. If npm or devdocs data is present, prioritize it heavily for concept structure.`

  const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYNTHESIZER_PROMPT },
      { role: 'user', content: prompt }
    ],
    max_tokens: 2500,
    temperature: 0.2
  }, {
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    timeout: 25000
  })

  const raw = res.data.choices[0].message.content || ''
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    const course = JSON.parse(jsonMatch[0]) as Course
    course.sources = collectSources(context)
    course.validationReport = {
      passed: false,
      autoFixed: [],
      warnings: [],
      errors: [],
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
    return course
  } catch (e) {
    console.error('[synthesizer] parse failed:', e, '\nraw:', raw.slice(0, 500))
    return null
  }
}

function buildContextSummary(context: ScrapedContext): string {
  const parts: string[] = []

  if (context.npm) {
    parts.push(`=== NPM PACKAGE (highest priority for this tool) ===
Package: ${context.npm.name}
Description: ${context.npm.description}
Keywords: ${context.npm.keywords.join(', ')}
README excerpt: ${context.npm.readme.slice(0, 1500)}`)
  }

  if (context.devdocs) {
    parts.push(`=== DEVDOCS (official documentation structure) ===
Docset: ${context.devdocs.docset}
Topics/sections: ${context.devdocs.topicsFound.join(', ')}`)
  }

  if (context.wikipedia) {
    parts.push(`=== WIKIPEDIA ===
Summary: ${context.wikipedia.summary.slice(0, 500)}
Sections: ${context.wikipedia.sections.join(', ')}
Related: ${context.wikipedia.relatedTopics.join(', ')}`)
  }

  if (context.wikidata) {
    parts.push(`=== WIKIDATA KNOWLEDGE GRAPH ===
Broader (prereqs): ${context.wikidata.broader.join(', ')}
Narrower (subtopics): ${context.wikidata.narrower.join(', ')}`)
  }

  if (context.openAlex) {
    parts.push(`=== OPENALEX ACADEMIC ===
Related concepts: ${context.openAlex.topConcepts.join(', ')}
Related fields: ${context.openAlex.relatedFields.join(', ')}`)
  }

  if (context.stackOverflow) {
    parts.push(`=== STACK OVERFLOW PAIN POINTS ===
What learners struggle with: ${context.stackOverflow.commonPainPoints.join(' | ')}
Top questions: ${context.stackOverflow.topQuestions.slice(0, 5).map(q => q.title).join(' | ')}`)
  }

  if (context.github) {
    parts.push(`=== GITHUB ===
Top repos: ${context.github.topRepos.slice(0, 3).map(r => r.name + ': ' + r.description).join(' | ')}`)
  }

  return parts.join('\n\n') || 'No external context — use your knowledge.'
}

function collectSources(context: ScrapedContext): string[] {
  const sources: string[] = []
  if (context.wikipedia) sources.push(context.wikipedia.url)
  if (context.openAlex) sources.push(context.openAlex.url)
  if (context.npm?.repoUrl) sources.push(context.npm.repoUrl)
  return sources
}
