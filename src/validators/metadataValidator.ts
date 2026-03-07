import { Course, ValidationReport } from '../types'

const GENERIC_TITLES = [
  'introduction', 'intro', 'basics', 'overview', 'fundamentals',
  'advanced topics', 'getting started', 'conclusion', 'summary',
  'misc', 'other'
]
const VAGUE_OUTCOME_WORDS = ['understand', 'know', 'learn', 'be aware', 'familiar with']
const ACTION_VERBS = ['build', 'implement', 'debug', 'design', 'analyze', 'create', 'apply', 'write', 'solve', 'use', 'configure', 'deploy', 'train', 'evaluate', 'predict', 'classify']

export function validateMetadata(course: Course, scrapedTopicTitles: string[]): ValidationReport {
  const autoFixed: string[] = []
  const warnings: string[] = []
  const errors: string[] = []

  // ── Sanitize prereq — LLM sometimes returns array ────────────────────────
  course.concepts = course.concepts.map((c) => {
    if (Array.isArray(c.prereq)) {
      const fixed = (c.prereq as string[])[0] || null
      autoFixed.push(`Prereq for "${c.title}" was array → extracted: "${fixed}"`)
      c.prereq = fixed
    }
    return c
  })

  // ── Concept title checks ─────────────────────────────────────────────────
  course.concepts = course.concepts.map((c, i) => {
    const lower = c.title.toLowerCase().trim()
    // only flag exact matches or very close matches — not "Introduction to X"
    const isGeneric = GENERIC_TITLES.some(g => lower === g || lower === g + 's')

    if (isGeneric) {
      warnings.push(`Concept ${i + 1} "${c.title}" title is too generic — LLM should have been more specific`)
    }

    if (c.title.split(' ').length < 2) {
      warnings.push(`Concept ${i + 1} title "${c.title}" is a single word — may be too vague`)
    }
    return c
  })

  // ── Time estimate checks ─────────────────────────────────────────────────
  course.concepts = course.concepts.map((c) => {
    if (c.estimatedMinutes < 5) {
      autoFixed.push(`Time for "${c.title}" was ${c.estimatedMinutes}min → set to 10min`)
      c.estimatedMinutes = 10
    }
    if (c.estimatedMinutes > 90) {
      autoFixed.push(`Time for "${c.title}" was ${c.estimatedMinutes}min → capped at 45min`)
      c.estimatedMinutes = 45
    }
    return c
  })

  // ── Prereq reference checks ──────────────────────────────────────────────
  const conceptTitles = course.concepts.map(c => c.title.toLowerCase())
  course.concepts = course.concepts.map((c) => {
    if (c.prereq && typeof c.prereq === 'string' && !conceptTitles.includes(c.prereq.toLowerCase())) {
      autoFixed.push(`Prereq "${c.prereq}" for "${c.title}" doesn't match any concept → cleared`)
      c.prereq = null
    }
    return c
  })

  // ── Concept count check ──────────────────────────────────────────────────
  if (course.concepts.length < 4) {
    errors.push(`Only ${course.concepts.length} concepts generated — minimum is 4`)
  }

  // ── Outcome quality checks ───────────────────────────────────────────────
  course.gist.outcomes = course.gist.outcomes.map((o, i) => {
    const lower = o.toLowerCase().trim()
    const isVague = VAGUE_OUTCOME_WORDS.some(v => lower.startsWith(v))
    const hasAction = ACTION_VERBS.some(v => lower.startsWith(v))
    const isTooShort = o.split(' ').length < 4

    if (isTooShort || (isVague && !hasAction)) {
      warnings.push(`Outcome ${i + 1} "${o}" is vague — needs to be a full sentence starting with an action verb`)
    }
    return o
  })

  // ── Emphasis quality check ───────────────────────────────────────────────
  if (course.gist.emphasis.split(' ').length < 15) {
    warnings.push('Course emphasis description is too short')
  }

  // ── Subtopics + description checks ──────────────────────────────────────
  course.concepts.forEach((c) => {
    if (!c.subtopics || c.subtopics.length === 0) {
      warnings.push(`Concept "${c.title}" has no subtopics`)
    }
    if (c.description && c.description.split(' ').length < 15) {
      warnings.push(`Concept "${c.title}" description is too short`)
    }
  })

  const passed = errors.length === 0

  return {
    passed, autoFixed, warnings, errors,
    sourcesCoverage: course.validationReport?.sourcesCoverage || {
      wikipedia: false, wikidata: false, openAlex: false, stackOverflow: false, github: false
    }
  }
}
