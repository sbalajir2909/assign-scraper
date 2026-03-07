export interface LearnerProfile {
  topic: string
  level: string
  goal: string
  time: string
}

export interface ConceptNode {
  title: string
  description: string
  subtopics: string[]
  estimatedMinutes: number
  prereq: string | null
  why: string
  sources: string[]
}

export interface CourseGist {
  emphasis: string
  outcomes: string[]
  prereqs: string[]
}

export interface Course {
  gist: CourseGist
  concepts: ConceptNode[]
  sources: string[]
  validationReport: ValidationReport
}

export interface ValidationReport {
  passed: boolean
  autoFixed: string[]
  warnings: string[]
  errors: string[]
  sourcesCoverage: {
    wikipedia: boolean
    wikidata: boolean
    openAlex: boolean
    stackOverflow: boolean
    github: boolean
  }
}

export interface ScrapedContext {
  wikipedia: WikipediaResult | null
  wikidata: WikidataResult | null
  openAlex: OpenAlexResult | null
  stackOverflow: StackOverflowResult | null
  github: GithubResult | null
}

export interface WikipediaResult {
  summary: string
  sections: string[]
  relatedTopics: string[]
  url: string
}

export interface WikidataResult {
  conceptGraph: { id: string; label: string; relation: string }[]
  prereqs: string[]
  broader: string[]
  narrower: string[]
}

export interface OpenAlexResult {
  topConcepts: string[]
  relatedFields: string[]
  url: string
}

export interface StackOverflowResult {
  topQuestions: { title: string; tags: string[] }[]
  commonPainPoints: string[]
}

export interface GithubResult {
  awesomeList: string | null
  topRepos: { name: string; description: string }[]
  learningResources: string[]
}
