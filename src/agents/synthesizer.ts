import axios from 'axios'
import { ScrapedContext, LearnerProfile, Course } from '../types'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYNTHESIZER_PROMPT = `You are a world-class curriculum designer. Build the best possible personalized course using real knowledge from multiple sources.

Respond ONLY with valid JSON in this exact shape, no text before or after:
{
  "gist": {
    "emphasis": "2-3 sentences on what this course emphasizes and why, specific to the learner's goal",
    "outcomes": [
      "Build a working ML classifier from scratch using scikit-learn",
      "Implement and evaluate a supervised learning model on real data",
      "Debug common ML errors like overfitting and data leakage"
    ],
    "prereqs": ["Basic Python programming knowledge"]
  },
  "concepts": [
    {
      "title": "Specific concept title (max 6 words, never generic like Introduction or Basics)",
      "description": "2-3 sentences minimum explaining what this concept is and why it matters",
      "why": "One sentence: why this specific concept matters for the learner's exact goal",
      "subtopics": ["subtopic 1", "subtopic 2", "subtopic 3"],
      "estimatedMinutes": 20,
      "prereq": null,
      "sources": ["Wikipedia", "OpenAlex"]
    }
  ]
}

CRITICAL RULES:
- outcomes MUST be full sentences starting with action verbs: "Build X", "Implement Y", "Debug Z", "Design A", "Analyze B", "Train C", "Deploy D" — never single words
- concept titles MUST be specific — never use: Introduction, Basics, Overview, Fundamentals, Getting Started, Summary, Advanced Topics
- estimatedMinutes: 10-45 per concept, realistic for the learner's time
- prereq: exact title of a previous concept in this list, or null — never an array
- 5-8 concepts ordered foundational to advanced
- Use Wikipedia sections as subtopics
- Use Stack Overflow pain points to decide what to emphasize
- prereqs in gist: only external knowledge needed before starting, empty array if none`

export async function synthesizeCourse(context: ScrapedContext, profile: LearnerProfile): Promise<Course | null> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set')

  const contextSummary = buildContextSummary(context)

  const prompt = `Learner profile:
- Topic: ${profile.topic}
- Current level: ${profile.level}
- Goal: ${profile.goal}  
- Available time: ${profile.time}

Real knowledge context from multiple sources:
${contextSummary}

Build the best possible course for this exact learner. Use the scraped context heavily — ground concept ordering in the Wikidata knowledge graph, use Wikipedia sections as subtopics, surface Stack Overflow pain points in the curriculum.`

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
        github: !!context.github
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

  if (context.wikipedia) {
    parts.push(`=== WIKIPEDIA ===
Summary: ${context.wikipedia.summary.slice(0, 600)}
Sections (use these as subtopics): ${context.wikipedia.sections.join(', ')}
Related topics: ${context.wikipedia.relatedTopics.join(', ')}`)
  }

  if (context.wikidata) {
    parts.push(`=== WIKIDATA KNOWLEDGE GRAPH ===
Broader concepts (good prereqs): ${context.wikidata.broader.join(', ')}
Narrower concepts (good subtopics/advanced concepts): ${context.wikidata.narrower.join(', ')}`)
  }

  if (context.openAlex) {
    parts.push(`=== OPENALEX ACADEMIC ===
Related academic concepts: ${context.openAlex.topConcepts.join(', ')}
Related fields: ${context.openAlex.relatedFields.join(', ')}`)
  }

  if (context.stackOverflow) {
    parts.push(`=== STACK OVERFLOW PAIN POINTS ===
What learners struggle with most: ${context.stackOverflow.commonPainPoints.join(' | ')}
Top questions: ${context.stackOverflow.topQuestions.slice(0, 5).map(q => q.title).join(' | ')}`)
  }

  if (context.github) {
    parts.push(`=== GITHUB COMMUNITY ===
Top learning resources: ${context.github.topRepos.slice(0, 3).map(r => r.name + ': ' + r.description).join(' | ')}`)
  }

  return parts.join('\n\n') || 'No external context — use your knowledge.'
}

function collectSources(context: ScrapedContext): string[] {
  const sources: string[] = []
  if (context.wikipedia) sources.push(context.wikipedia.url)
  if (context.openAlex) sources.push(context.openAlex.url)
  return sources
}
