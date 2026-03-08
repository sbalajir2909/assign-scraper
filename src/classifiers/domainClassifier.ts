export type Domain =
  | 'cs_programming'
  | 'medicine_health'
  | 'law_legal'
  | 'finance_accounting'
  | 'engineering_aviation'
  | 'science_physics_chemistry'
  | 'biology_life_sciences'
  | 'mathematics'
  | 'humanities_history'
  | 'language_literature'
  | 'exam_upsc_ias'
  | 'exam_jee_neet'
  | 'exam_ca_cma_cs'
  | 'exam_gate'
  | 'exam_banking_ssc'
  | 'exam_sat_gre_gmat'
  | 'exam_ielts_toefl'
  | 'school_k12'
  | 'business_management'
  | 'arts_design'
  | 'general'

export interface DomainResult {
  domain: Domain
  subdomains: string[]
  sources: SourceConfig
}

export interface SourceConfig {
  useArxiv: boolean
  useSemanticScholar: boolean
  usePubmed: boolean
  useNasa: boolean
  useNcert: boolean
  useOpenStax: boolean
  useYoutube: boolean
  useConceptNet: boolean
  useLegal: boolean
  useFinance: boolean
  useExamSources: boolean
  useNpm: boolean
  useDevdocs: boolean
  youtubeChannels?: string[] // prioritize these channels
  examBoards?: string[]      // specific exam boards to target
  officialSites?: string[]   // official sites to reference
}

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
  cs_programming: [
    'programming', 'coding', 'software', 'algorithm', 'data structure', 'python', 'javascript',
    'typescript', 'react', 'node', 'api', 'database', 'sql', 'nosql', 'machine learning',
    'deep learning', 'neural network', 'ai', 'artificial intelligence', 'computer science',
    'operating system', 'networking', 'cybersecurity', 'blockchain', 'cloud', 'devops',
    'kubernetes', 'docker', 'git', 'compiler', 'web development', 'backend', 'frontend',
    'microservices', 'system design', 'leetcode', 'dsa', 'object oriented', 'functional',
    'rust', 'golang', 'java', 'c++', 'assembly', 'embedded', 'iot', 'sdk', 'framework',
    'library', 'npm', 'package', 'llm', 'gpt', 'transformer', 'nlp'
  ],
  medicine_health: [
    'medicine', 'medical', 'health', 'disease', 'anatomy', 'physiology', 'pharmacology',
    'surgery', 'diagnosis', 'treatment', 'clinical', 'hospital', 'patient', 'drug',
    'cancer', 'diabetes', 'cardiology', 'neurology', 'psychiatry', 'pediatrics',
    'oncology', 'immunology', 'pathology', 'radiology', 'neet', 'mbbs', 'nursing',
    'public health', 'epidemiology', 'virology', 'bacteriology', 'genetics', 'dna',
    'protein', 'cell biology', 'biochemistry', 'nutrition', 'therapy', 'vaccine'
  ],
  law_legal: [
    'law', 'legal', 'constitution', 'court', 'judge', 'lawyer', 'attorney', 'contract',
    'criminal', 'civil', 'corporate law', 'intellectual property', 'patent', 'trademark',
    'ipc', 'crpc', 'evidence act', 'bar exam', 'llb', 'llm', 'jurisprudence',
    'litigation', 'arbitration', 'supreme court', 'high court', 'statute', 'legislation',
    'fundamental rights', 'directive principles', 'constitutional law', 'tort', 'equity'
  ],
  finance_accounting: [
    'finance', 'accounting', 'ca', 'chartered accountant', 'cma', 'cs company secretary',
    'audit', 'taxation', 'gst', 'income tax', 'balance sheet', 'financial statement',
    'investment', 'stock market', 'portfolio', 'derivatives', 'forex', 'banking',
    'rbi', 'sebi', 'mutual fund', 'insurance', 'cfa', 'cpa', 'ifrs', 'ind as',
    'financial management', 'corporate finance', 'valuation', 'budgeting', 'economics',
    'microeconomics', 'macroeconomics', 'gdp', 'inflation', 'monetary policy'
  ],
  engineering_aviation: [
    'engineering', 'mechanical', 'electrical', 'civil', 'aerospace', 'aviation',
    'aeronautics', 'aircraft', 'pilot', 'atpl', 'cpl', 'dgca', 'faa', 'aviation law',
    'thermodynamics', 'fluid mechanics', 'structural', 'materials science', 'manufacturing',
    'robotics', 'control systems', 'signal processing', 'vlsi', 'semiconductor',
    'power systems', 'renewable energy', 'construction', 'surveying', 'geotechnical',
    'aerospace engineering', 'propulsion', 'aerodynamics', 'avionics', 'gate exam'
  ],
  science_physics_chemistry: [
    'physics', 'chemistry', 'quantum', 'relativity', 'mechanics', 'electromagnetism',
    'thermodynamics', 'optics', 'nuclear', 'particle physics', 'organic chemistry',
    'inorganic chemistry', 'physical chemistry', 'reaction', 'molecule', 'atom',
    'periodic table', 'chemical bond', 'spectroscopy', 'crystallography', 'polymer',
    'nanotechnology', 'materials', 'astronomy', 'astrophysics', 'cosmology', 'jee chemistry'
  ],
  biology_life_sciences: [
    'biology', 'ecology', 'evolution', 'genetics', 'genomics', 'botany', 'zoology',
    'microbiology', 'cell', 'organism', 'species', 'taxonomy', 'photosynthesis',
    'respiration', 'reproduction', 'biodiversity', 'environment', 'ecosystem',
    'marine biology', 'neuroscience', 'developmental biology', 'biotechnology', 'neet biology'
  ],
  mathematics: [
    'mathematics', 'maths', 'calculus', 'algebra', 'geometry', 'trigonometry',
    'statistics', 'probability', 'number theory', 'topology', 'linear algebra',
    'differential equations', 'real analysis', 'complex analysis', 'discrete math',
    'combinatorics', 'graph theory', 'optimization', 'numerical methods', 'jee maths'
  ],
  humanities_history: [
    'history', 'civilization', 'ancient', 'medieval', 'modern history', 'world war',
    'empire', 'dynasty', 'revolution', 'philosophy', 'ethics', 'logic', 'metaphysics',
    'political science', 'sociology', 'anthropology', 'archaeology', 'culture',
    'religion', 'mythology', 'art history', 'geography', 'upsc history', 'ncert history'
  ],
  language_literature: [
    'literature', 'english literature', 'poetry', 'novel', 'drama', 'shakespeare',
    'grammar', 'linguistics', 'language', 'writing', 'communication', 'rhetoric',
    'hindi literature', 'vernacular', 'ielts', 'toefl', 'reading comprehension',
    'vocabulary', 'essay writing', 'creative writing'
  ],
  exam_upsc_ias: [
    'upsc', 'ias', 'ips', 'ifs', 'civil services', 'prelims', 'mains', 'essay paper',
    'general studies', 'csat', 'optional subject', 'current affairs upsc',
    'polity', 'governance', 'international relations upsc', 'economy upsc',
    'environment upsc', 'science technology upsc', 'art culture upsc', 'lbsnaa'
  ],
  exam_jee_neet: [
    'jee', 'jee main', 'jee advanced', 'neet', 'neet ug', 'iit', 'nit', 'bitsat',
    'viteee', 'comedk', 'class 11', 'class 12', 'pcm', 'pcb', 'cbse board',
    'entrance exam', 'nta exam', 'iit preparation', 'medical entrance'
  ],
  exam_ca_cma_cs: [
    'ca foundation', 'ca intermediate', 'ca final', 'icai', 'cma foundation',
    'cma intermediate', 'cma final', 'icmai', 'cs foundation', 'cs executive',
    'cs professional', 'icsi', 'chartered accountancy', 'cost accounting',
    'company secretary', 'articleship', 'audit paper', 'law paper ca'
  ],
  exam_gate: [
    'gate', 'gate exam', 'gate preparation', 'gate cse', 'gate ece', 'gate me',
    'gate civil', 'gate ee', 'psu recruitment', 'iit gate', 'gate syllabus',
    'technical aptitude', 'engineering aptitude'
  ],
  exam_banking_ssc: [
    'banking', 'ssc', 'ibps', 'sbi po', 'sbi clerk', 'rrb', 'railway exam',
    'rbi grade b', 'nabard', 'ssc cgl', 'ssc chsl', 'reasoning', 'quantitative aptitude',
    'english for banking', 'general awareness', 'current affairs banking'
  ],
  exam_sat_gre_gmat: [
    'sat', 'gre', 'gmat', 'act', 'ap exam', 'college board', 'verbal reasoning',
    'quantitative reasoning', 'analytical writing', 'data sufficiency', 'critical reasoning',
    'reading comprehension gre', 'math sat', 'us college admission'
  ],
  exam_ielts_toefl: [
    'ielts', 'toefl', 'pte', 'duolingo english', 'speaking band', 'writing task',
    'listening ielts', 'reading ielts', 'band score', 'academic ielts', 'general ielts',
    'toefl ibt', 'english proficiency'
  ],
  school_k12: [
    'class 1', 'class 2', 'class 3', 'class 4', 'class 5', 'class 6', 'class 7',
    'class 8', 'class 9', 'class 10', 'primary school', 'middle school', 'high school',
    'cbse', 'icse', 'state board', 'ncert', 'school syllabus', 'board exam',
    'igcse', 'ib diploma', 'a level', 'gcse', 'o level', 'k12', 'kindergarten'
  ],
  business_management: [
    'business', 'management', 'mba', 'marketing', 'strategy', 'operations',
    'human resources', 'organizational behavior', 'entrepreneurship', 'startup',
    'product management', 'project management', 'supply chain', 'logistics',
    'business analysis', 'consulting', 'leadership', 'negotiation'
  ],
  arts_design: [
    'art', 'design', 'graphic design', 'ux', 'ui', 'visual design', 'typography',
    'color theory', 'illustration', 'animation', 'film', 'photography', 'music theory',
    'architecture', 'interior design', 'fashion', 'sculpture', 'painting', 'drawing'
  ],
  general: []
}

const SOURCE_CONFIGS: Record<Domain, SourceConfig> = {
  cs_programming: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: false, useYoutube: true, useConceptNet: true,
    useLegal: false, useFinance: false, useExamSources: false, useNpm: true, useDevdocs: true,
    youtubeChannels: ['MIT OpenCourseWare', 'Fireship', 'Computerphile', 'CS Dojo', '3Blue1Brown', 'Andrej Karpathy']
  },
  medicine_health: {
    useArxiv: true, useSemanticScholar: true, usePubmed: true, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['Osmosis', 'Ninja Nerd', 'Armando Hasudungan', 'Boards and Beyond'],
    officialSites: ['pubmed.ncbi.nlm.nih.gov', 'who.int', 'nih.gov']
  },
  law_legal: {
    useArxiv: false, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: false, useYoutube: true, useConceptNet: false,
    useLegal: true, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['LexBites', 'Legal Bites', 'Law Sikho'],
    officialSites: ['indiankanoon.org', 'legalserviceindia.com', 'barandbench.com']
  },
  finance_accounting: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: true, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['CA Wallah', 'Unacademy CA', 'ICAI videos', 'Investopedia'],
    officialSites: ['icai.org', 'rbi.org.in', 'sebi.gov.in', 'incometaxindia.gov.in']
  },
  engineering_aviation: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: true,
    useNcert: false, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['MIT OpenCourseWare', 'NPTEL', 'Real Engineering', 'Scott Manley'],
    officialSites: ['faa.gov', 'nasa.gov', 'nist.gov', 'dgca.gov.in']
  },
  science_physics_chemistry: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['3Blue1Brown', 'Veritasium', 'Khan Academy', 'MIT OpenCourseWare', 'NPTEL']
  },
  biology_life_sciences: {
    useArxiv: true, useSemanticScholar: true, usePubmed: true, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['Amoeba Sisters', 'CrashCourse Biology', 'Khan Academy', 'NPTEL']
  },
  mathematics: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['3Blue1Brown', 'Khan Academy', 'PatrickJMT', 'MIT OpenCourseWare', 'Mathologer']
  },
  humanities_history: {
    useArxiv: false, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: true,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['CrashCourse', 'Overly Sarcastic Productions', 'Khan Academy', 'UPSC Wallah']
  },
  language_literature: {
    useArxiv: false, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: false, useYoutube: true, useConceptNet: true,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['E2 IELTS', 'British Council', 'IELTS Liz', 'Learn English with Emma']
  },
  exam_upsc_ias: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: false, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['UPSC Wallah', 'StudyIQ IAS', 'Unacademy IAS', 'Drishti IAS', 'Vision IAS'],
    officialSites: ['upsc.gov.in', 'pib.gov.in', 'prsindia.org', 'ncert.nic.in']
  },
  exam_jee_neet: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['Physics Wallah', 'Vedantu JEE', 'Unacademy JEE', 'Khan Academy', 'Etoos India'],
    officialSites: ['nta.ac.in', 'ncert.nic.in', 'jeemain.nta.ac.in']
  },
  exam_ca_cma_cs: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: false, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: true, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['ICAI', 'CA Wallah', 'Unacademy CA', 'CA Inter', 'Sripal Jain'],
    officialSites: ['icai.org', 'icmai.in', 'icsi.edu', 'mca.gov.in']
  },
  exam_gate: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['GATE Wallah', 'Made Easy', 'Unacademy GATE', 'NPTEL'],
    officialSites: ['gate.iit.ac.in', 'nptel.ac.in']
  },
  exam_banking_ssc: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: false, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['Adda247', 'Oliveboard', 'Wifistudy', 'Bank Wallah'],
    officialSites: ['ibps.in', 'ssc.nic.in', 'rbi.org.in', 'bankersadda.com']
  },
  exam_sat_gre_gmat: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['GregMat', 'Manhattan Prep', 'Khan Academy SAT', 'Target Test Prep'],
    officialSites: ['collegeboard.org', 'ets.org', 'mba.com']
  },
  exam_ielts_toefl: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: false, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['E2 IELTS', 'IELTS Liz', 'British Council', 'IELTS Simon', 'Magoosh TOEFL'],
    officialSites: ['ielts.org', 'toefl.ets.org', 'britishcouncil.org']
  },
  school_k12: {
    useArxiv: false, useSemanticScholar: false, usePubmed: false, useNasa: false,
    useNcert: true, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: false, useExamSources: true, useNpm: false, useDevdocs: false,
    youtubeChannels: ['Khan Academy', 'Physics Wallah', 'Vedantu', 'BBC Bitesize', 'CrashCourse'],
    officialSites: ['ncert.nic.in', 'diksha.gov.in', 'cbseacademic.nic.in']
  },
  business_management: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: true, useYoutube: true, useConceptNet: false,
    useLegal: false, useFinance: true, useExamSources: false, useNpm: false, useDevdocs: false,
    youtubeChannels: ['Harvard Business Review', 'Y Combinator', 'Stanford GSB', 'Wharton School']
  },
  arts_design: {
    useArxiv: false, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: false, useYoutube: true, useConceptNet: true,
    useLegal: false, useFinance: false, useExamSources: false, useNpm: false, useDevdocs: false,
    youtubeChannels: ['The Futur', 'Proko', 'Blender Guru', 'Adobe', 'DesignCourse']
  },
  general: {
    useArxiv: true, useSemanticScholar: true, usePubmed: false, useNasa: false,
    useNcert: false, useOpenStax: true, useYoutube: true, useConceptNet: true,
    useLegal: false, useFinance: false, useExamSources: false, useNpm: false, useDevdocs: false
  }
}

export function classifyDomain(topic: string): DomainResult {
  const lower = topic.toLowerCase()
  const scores: Record<Domain, number> = {} as Record<Domain, number>

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        // longer keyword matches = higher confidence
        score += keyword.split(' ').length
      }
    }
    scores[domain as Domain] = score
  }

  // find best matching domain
  let bestDomain: Domain = 'general'
  let bestScore = 0
  for (const [domain, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestDomain = domain as Domain
    }
  }

  // find top subdomains (secondary matches)
  const sorted = Object.entries(scores)
    .filter(([d]) => d !== bestDomain && d !== 'general')
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([d]) => d)

  return {
    domain: bestDomain,
    subdomains: sorted,
    sources: SOURCE_CONFIGS[bestDomain]
  }
}