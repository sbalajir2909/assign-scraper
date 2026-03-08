export interface NcertResult {
  title: string
  subject: string
  class: string
  chapter: string
  url: string
  pdfUrl: string
  type: 'textbook' | 'exemplar' | 'lab_manual'
}

// NCERT textbook catalog - these PDFs are publicly available
const NCERT_BOOKS: NcertResult[] = [
  // Class 11-12 Science
  { title: 'Physics Part I Class 11', subject: 'physics', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?keph1=0-14', pdfUrl: 'https://ncert.nic.in/ncerts/l/keph101.pdf', type: 'textbook' },
  { title: 'Physics Part II Class 11', subject: 'physics', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?keph2=0-14', pdfUrl: 'https://ncert.nic.in/ncerts/l/keph201.pdf', type: 'textbook' },
  { title: 'Physics Part I Class 12', subject: 'physics', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?leph1=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/leph101.pdf', type: 'textbook' },
  { title: 'Physics Part II Class 12', subject: 'physics', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?leph2=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/leph201.pdf', type: 'textbook' },
  { title: 'Chemistry Part I Class 11', subject: 'chemistry', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?kech1=0-14', pdfUrl: 'https://ncert.nic.in/ncerts/l/kech101.pdf', type: 'textbook' },
  { title: 'Chemistry Part II Class 11', subject: 'chemistry', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?kech2=0-14', pdfUrl: 'https://ncert.nic.in/ncerts/l/kech201.pdf', type: 'textbook' },
  { title: 'Chemistry Part I Class 12', subject: 'chemistry', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lech1=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/lech101.pdf', type: 'textbook' },
  { title: 'Chemistry Part II Class 12', subject: 'chemistry', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lech2=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/lech201.pdf', type: 'textbook' },
  { title: 'Biology Class 11', subject: 'biology', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?kebo1=0-22', pdfUrl: 'https://ncert.nic.in/ncerts/l/kebo101.pdf', type: 'textbook' },
  { title: 'Biology Class 12', subject: 'biology', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lebo1=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/lebo101.pdf', type: 'textbook' },
  { title: 'Mathematics Class 11', subject: 'mathematics', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?kemh1=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/kemh101.pdf', type: 'textbook' },
  { title: 'Mathematics Class 12 Part I', subject: 'mathematics', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lemh1=0-13', pdfUrl: 'https://ncert.nic.in/ncerts/l/lemh101.pdf', type: 'textbook' },
  // Class 9-10
  { title: 'Science Class 9', subject: 'science', class: '9', chapter: '', url: 'https://ncert.nic.in/textbook.php?iesc1=0-15', pdfUrl: 'https://ncert.nic.in/ncerts/l/iesc101.pdf', type: 'textbook' },
  { title: 'Science Class 10', subject: 'science', class: '10', chapter: '', url: 'https://ncert.nic.in/textbook.php?jesc1=0-16', pdfUrl: 'https://ncert.nic.in/ncerts/l/jesc101.pdf', type: 'textbook' },
  { title: 'Mathematics Class 9', subject: 'mathematics', class: '9', chapter: '', url: 'https://ncert.nic.in/textbook.php?iemh1=0-15', pdfUrl: 'https://ncert.nic.in/ncerts/l/iemh101.pdf', type: 'textbook' },
  { title: 'Mathematics Class 10', subject: 'mathematics', class: '10', chapter: '', url: 'https://ncert.nic.in/textbook.php?jemh1=0-15', pdfUrl: 'https://ncert.nic.in/ncerts/l/jemh101.pdf', type: 'textbook' },
  // History/Polity for UPSC
  { title: 'Indian History Class 12 - Themes in Indian History I', subject: 'history', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lhis1=0-12', pdfUrl: 'https://ncert.nic.in/ncerts/l/lhis101.pdf', type: 'textbook' },
  { title: 'Indian History Class 12 - Themes in Indian History II', subject: 'history', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lhis2=0-10', pdfUrl: 'https://ncert.nic.in/ncerts/l/lhis201.pdf', type: 'textbook' },
  { title: 'Political Science Class 11 - Political Theory', subject: 'polity', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?keps1=0-10', pdfUrl: 'https://ncert.nic.in/ncerts/l/keps101.pdf', type: 'textbook' },
  { title: 'Political Science Class 12 - Contemporary World Politics', subject: 'polity', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?leps1=0-9', pdfUrl: 'https://ncert.nic.in/ncerts/l/leps101.pdf', type: 'textbook' },
  { title: 'Economics Class 11 - Statistics', subject: 'economics', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?kest1=0-9', pdfUrl: 'https://ncert.nic.in/ncerts/l/kest101.pdf', type: 'textbook' },
  { title: 'Economics Class 12 - Macroeconomics', subject: 'economics', class: '12', chapter: '', url: 'https://ncert.nic.in/textbook.php?lmec1=0-6', pdfUrl: 'https://ncert.nic.in/ncerts/l/lmec101.pdf', type: 'textbook' },
  { title: 'Geography Class 11 - Fundamentals of Physical Geography', subject: 'geography', class: '11', chapter: '', url: 'https://ncert.nic.in/textbook.php?kefg1=0-8', pdfUrl: 'https://ncert.nic.in/ncerts/l/kefg101.pdf', type: 'textbook' },
]

const SUBJECT_KEYWORDS: Record<string, string[]> = {
  physics: ['physics', 'mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'wave', 'quantum', 'jee physics', 'neet physics'],
  chemistry: ['chemistry', 'organic', 'inorganic', 'physical chemistry', 'reaction', 'molecule', 'chemical', 'jee chemistry', 'neet chemistry'],
  biology: ['biology', 'cell', 'genetics', 'evolution', 'ecology', 'anatomy', 'physiology', 'neet biology', 'botany', 'zoology'],
  mathematics: ['mathematics', 'maths', 'calculus', 'algebra', 'geometry', 'trigonometry', 'statistics', 'jee maths'],
  science: ['science', 'class 9', 'class 10', 'cbse science', 'board science'],
  history: ['history', 'ancient india', 'medieval india', 'modern india', 'upsc history', 'civilization'],
  polity: ['polity', 'political science', 'constitution', 'governance', 'upsc polity', 'parliament'],
  economics: ['economics', 'macroeconomics', 'microeconomics', 'upsc economy', 'gdp', 'inflation'],
  geography: ['geography', 'physical geography', 'human geography', 'upsc geography', 'climate', 'landform'],
}

export function findNcertResources(topic: string): NcertResult[] {
  const lower = topic.toLowerCase()
  const matches: NcertResult[] = []

  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      const subjectBooks = NCERT_BOOKS.filter(b => b.subject === subject)
      matches.push(...subjectBooks.slice(0, 2))
    }
  }

  return matches.slice(0, 4)
}