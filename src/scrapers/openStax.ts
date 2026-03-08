export interface OpenStaxResult {
  title: string
  subject: string
  url: string
  pdfUrl: string
  description: string
  coverUrl: string
}

// OpenStax publishes all books as open access - these are stable URLs
const OPENSTAX_BOOKS: OpenStaxResult[] = [
  // Science
  { title: 'University Physics Volume 1', subject: 'physics', url: 'https://openstax.org/details/books/university-physics-volume-1', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVol1-WEB_sNSfVkB.pdf', description: 'Mechanics, waves, and thermodynamics for university students', coverUrl: '' },
  { title: 'University Physics Volume 2', subject: 'physics', url: 'https://openstax.org/details/books/university-physics-volume-2', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVol2-WEB.pdf', description: 'Thermodynamics, electricity, and magnetism', coverUrl: '' },
  { title: 'University Physics Volume 3', subject: 'physics', url: 'https://openstax.org/details/books/university-physics-volume-3', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVol3-WEB.pdf', description: 'Optics and modern physics', coverUrl: '' },
  { title: 'Chemistry: Atoms First 2e', subject: 'chemistry', url: 'https://openstax.org/details/books/chemistry-atoms-first-2e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/ChemistryAtomsFirst2e-WEB_zxrfAOJ.pdf', description: 'Comprehensive general chemistry textbook', coverUrl: '' },
  { title: 'Organic Chemistry', subject: 'organic chemistry', url: 'https://openstax.org/details/books/organic-chemistry', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/OrganicChemistry-WEB.pdf', description: 'Full organic chemistry course', coverUrl: '' },
  { title: 'Biology 2e', subject: 'biology', url: 'https://openstax.org/details/books/biology-2e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/Biology2e-WEB_68bVtMX.pdf', description: 'Comprehensive biology for college students', coverUrl: '' },
  { title: 'Microbiology', subject: 'microbiology', url: 'https://openstax.org/details/books/microbiology', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/Microbiology-WEB.pdf', description: 'Introduction to microbiology', coverUrl: '' },
  { title: 'Anatomy and Physiology', subject: 'anatomy', url: 'https://openstax.org/details/books/anatomy-and-physiology', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/AnatomyandPhysiology-WEB.pdf', description: 'Human anatomy and physiology', coverUrl: '' },
  // Math
  { title: 'Calculus Volume 1', subject: 'calculus', url: 'https://openstax.org/details/books/calculus-volume-1', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVol1-WEB.pdf', description: 'Single-variable calculus', coverUrl: '' },
  { title: 'Calculus Volume 2', subject: 'calculus', url: 'https://openstax.org/details/books/calculus-volume-2', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVol2-WEB.pdf', description: 'Integration techniques and series', coverUrl: '' },
  { title: 'Calculus Volume 3', subject: 'calculus', url: 'https://openstax.org/details/books/calculus-volume-3', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVol3-WEB.pdf', description: 'Multivariable calculus', coverUrl: '' },
  { title: 'Algebra and Trigonometry 2e', subject: 'algebra', url: 'https://openstax.org/details/books/algebra-and-trigonometry-2e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/AlgebraandTrigonometry2e-WEB.pdf', description: 'College algebra and trig', coverUrl: '' },
  { title: 'Statistics', subject: 'statistics', url: 'https://openstax.org/details/books/introductory-statistics', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/IntroductoryStatistics-WEB.pdf', description: 'Introductory statistics', coverUrl: '' },
  { title: 'Linear Algebra with Applications', subject: 'linear algebra', url: 'https://openstax.org/details/books/linear-algebra-with-applications', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/LinearAlgebraWithApplications-WEB.pdf', description: 'Linear algebra for STEM students', coverUrl: '' },
  // Business/Economics
  { title: 'Principles of Economics 3e', subject: 'economics', url: 'https://openstax.org/details/books/principles-economics-3e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/PrinciplesofEconomics3e-WEB.pdf', description: 'Micro and macroeconomics', coverUrl: '' },
  { title: 'Principles of Macroeconomics 3e', subject: 'macroeconomics', url: 'https://openstax.org/details/books/principles-macroeconomics-3e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/PrinciplesofMacroeconomics3e-WEB.pdf', description: 'Macroeconomics', coverUrl: '' },
  { title: 'Principles of Microeconomics 3e', subject: 'microeconomics', url: 'https://openstax.org/details/books/principles-microeconomics-3e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/PrinciplesofMicroeconomics3e-WEB.pdf', description: 'Microeconomics', coverUrl: '' },
  { title: 'Introduction to Business', subject: 'business', url: 'https://openstax.org/details/books/introduction-business', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/IntroductionToBusiness-WEB.pdf', description: 'Business fundamentals', coverUrl: '' },
  { title: 'Principles of Accounting Volume 1', subject: 'accounting', url: 'https://openstax.org/details/books/principles-financial-accounting', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/PrinciplesofAccounting-WEB.pdf', description: 'Financial accounting', coverUrl: '' },
  // CS
  { title: 'Introduction to Python Programming', subject: 'python', url: 'https://openstax.org/details/books/introduction-python-programming', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/IntroductionToPythonProgramming-WEB.pdf', description: 'Python programming from scratch', coverUrl: '' },
  // Humanities
  { title: 'American Government 3e', subject: 'political science', url: 'https://openstax.org/details/books/american-government-3e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/AmericanGovernment3e-WEB.pdf', description: 'US government and politics', coverUrl: '' },
  { title: 'Introduction to Sociology 3e', subject: 'sociology', url: 'https://openstax.org/details/books/introduction-sociology-3e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/IntroductiontoSociology3e-WEB.pdf', description: 'Sociology fundamentals', coverUrl: '' },
  { title: 'Psychology 2e', subject: 'psychology', url: 'https://openstax.org/details/books/psychology-2e', pdfUrl: 'https://assets.openstax.org/oscms-prodcms/media/documents/Psychology2e-WEB.pdf', description: 'Introduction to psychology', coverUrl: '' },
]

const SUBJECT_MAP: Record<string, string[]> = {
  physics: ['physics', 'mechanics', 'thermodynamics', 'electromagnetism', 'waves', 'optics'],
  chemistry: ['chemistry', 'chemical', 'reaction', 'molecule', 'atom', 'periodic'],
  'organic chemistry': ['organic chemistry', 'organic compound', 'carbon chemistry'],
  biology: ['biology', 'cell', 'genetics', 'evolution', 'ecosystem', 'organism'],
  microbiology: ['microbiology', 'bacteria', 'virus', 'pathogen', 'microorganism'],
  anatomy: ['anatomy', 'physiology', 'human body', 'organ system', 'medical'],
  calculus: ['calculus', 'differentiation', 'integration', 'limits', 'derivatives'],
  algebra: ['algebra', 'trigonometry', 'polynomial', 'equation', 'function'],
  statistics: ['statistics', 'probability', 'distribution', 'regression', 'data analysis'],
  'linear algebra': ['linear algebra', 'matrix', 'vector space', 'eigenvalue'],
  economics: ['economics', 'economy', 'supply demand', 'market', 'economic'],
  macroeconomics: ['macroeconomics', 'gdp', 'inflation', 'monetary policy', 'fiscal'],
  microeconomics: ['microeconomics', 'consumer behavior', 'market structure', 'elasticity'],
  business: ['business', 'management', 'entrepreneurship', 'organization'],
  accounting: ['accounting', 'financial statement', 'bookkeeping', 'ledger', 'audit'],
  python: ['python', 'programming', 'coding', 'software'],
  'political science': ['political science', 'government', 'democracy', 'politics'],
  sociology: ['sociology', 'society', 'social', 'culture', 'community'],
  psychology: ['psychology', 'behavior', 'cognitive', 'mental health', 'emotion'],
}

export function findOpenStaxBooks(topic: string): OpenStaxResult[] {
  const lower = topic.toLowerCase()
  const matches: OpenStaxResult[] = []

  for (const [subject, keywords] of Object.entries(SUBJECT_MAP)) {
    if (keywords.some(k => lower.includes(k))) {
      const book = OPENSTAX_BOOKS.find(b => b.subject === subject)
      if (book) matches.push(book)
    }
  }

  return matches.slice(0, 3)
}