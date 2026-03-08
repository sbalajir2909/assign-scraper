export interface ExamResource {
  name: string
  type: 'syllabus' | 'previous_papers' | 'study_material' | 'official_notification' | 'mock_test'
  url: string
  description: string
  examBoard: string
  free: boolean
}

const EXAM_RESOURCES: Record<string, ExamResource[]> = {
  upsc_ias: [
    { name: 'UPSC Official Syllabus - Civil Services Examination', type: 'syllabus', url: 'https://upsc.gov.in/examinations/civil-services-examination', description: 'Complete official syllabus for IAS/IPS/IFS Prelims and Mains', examBoard: 'UPSC', free: true },
    { name: 'UPSC Previous Year Question Papers', type: 'previous_papers', url: 'https://upsc.gov.in/examinations/annual-calender', description: 'Previous year papers for all UPSC exams', examBoard: 'UPSC', free: true },
    { name: 'NCERT Books for UPSC', type: 'study_material', url: 'https://ncert.nic.in/textbook.php', description: 'NCERT class 6-12 books essential for UPSC preparation', examBoard: 'UPSC', free: true },
    { name: 'PIB - Press Information Bureau', type: 'study_material', url: 'https://pib.gov.in', description: 'Official government press releases for current affairs', examBoard: 'UPSC', free: true },
    { name: 'PRS India - Legislative Research', type: 'study_material', url: 'https://prsindia.org', description: 'Bills, acts and policy analysis for GS2/GS3', examBoard: 'UPSC', free: true },
  ],
  jee: [
    { name: 'JEE Main Official Syllabus', type: 'syllabus', url: 'https://jeemain.nta.ac.in', description: 'Official JEE Main syllabus for Physics, Chemistry, Mathematics', examBoard: 'NTA', free: true },
    { name: 'JEE Advanced Official Syllabus', type: 'syllabus', url: 'https://jeeadv.ac.in', description: 'IIT JEE Advanced complete syllabus', examBoard: 'IIT', free: true },
    { name: 'JEE Previous Year Papers', type: 'previous_papers', url: 'https://jeemain.nta.ac.in/previous-year-question-paper', description: 'Previous year JEE Main papers with solutions', examBoard: 'NTA', free: true },
    { name: 'NCERT - Class 11 & 12 Science', type: 'study_material', url: 'https://ncert.nic.in/textbook.php', description: 'NCERT textbooks for PCM/PCB - foundation for JEE/NEET', examBoard: 'NCERT', free: true },
  ],
  neet: [
    { name: 'NEET Official Syllabus', type: 'syllabus', url: 'https://neet.nta.nic.in', description: 'Complete NEET UG syllabus - Physics, Chemistry, Biology', examBoard: 'NTA', free: true },
    { name: 'NEET Previous Year Papers', type: 'previous_papers', url: 'https://neet.nta.nic.in/previous-year-question-paper', description: 'NEET previous years question papers', examBoard: 'NTA', free: true },
    { name: 'AIIMS Previous Papers', type: 'previous_papers', url: 'https://www.aiimsexams.ac.in', description: 'AIIMS entrance exam papers', examBoard: 'AIIMS', free: true },
  ],
  ca: [
    { name: 'ICAI Study Material - CA Foundation', type: 'study_material', url: 'https://www.icai.org/post/study-material-ca-foundation', description: 'Official ICAI study material for CA Foundation', examBoard: 'ICAI', free: true },
    { name: 'ICAI Study Material - CA Intermediate', type: 'study_material', url: 'https://www.icai.org/post/study-material-ca-intermediate', description: 'Official ICAI study material for CA Inter', examBoard: 'ICAI', free: true },
    { name: 'ICAI Study Material - CA Final', type: 'study_material', url: 'https://www.icai.org/post/study-material-ca-final', description: 'Official ICAI study material for CA Final', examBoard: 'ICAI', free: true },
    { name: 'ICAI Previous Year Papers', type: 'previous_papers', url: 'https://www.icai.org/past-question-paper', description: 'ICAI past exam question papers', examBoard: 'ICAI', free: true },
    { name: 'ICAI BoS Knowledge Portal', type: 'study_material', url: 'https://boslive.icai.org', description: 'Board of Studies free e-learning for CA students', examBoard: 'ICAI', free: true },
  ],
  cma: [
    { name: 'ICMAI Study Material', type: 'study_material', url: 'https://icmai.in/studymaterial', description: 'Official CMA Foundation/Inter/Final study material', examBoard: 'ICMAI', free: true },
    { name: 'ICMAI Question Papers', type: 'previous_papers', url: 'https://icmai.in/question_papers', description: 'Previous year CMA examination papers', examBoard: 'ICMAI', free: true },
  ],
  cs: [
    { name: 'ICSI Study Material', type: 'study_material', url: 'https://www.icsi.edu/student/study-material', description: 'Company Secretary Foundation/Executive/Professional study material', examBoard: 'ICSI', free: true },
    { name: 'ICSI E-Learning', type: 'study_material', url: 'https://elearning.icsi.edu', description: 'Free e-learning modules for CS students', examBoard: 'ICSI', free: true },
  ],
  gate: [
    { name: 'GATE Official Syllabus', type: 'syllabus', url: 'https://gate2025.iitr.ac.in/syllabus', description: 'Complete GATE syllabus for all engineering branches', examBoard: 'IIT', free: true },
    { name: 'GATE Previous Year Papers', type: 'previous_papers', url: 'https://gate.iit.ac.in/previous-question-paper', description: 'GATE previous year question papers with solutions', examBoard: 'IIT', free: true },
    { name: 'NPTEL Free Courses', type: 'study_material', url: 'https://nptel.ac.in/courses', description: 'IIT/IISc lectures covering all GATE subjects', examBoard: 'NPTEL', free: true },
  ],
  banking_ssc: [
    { name: 'IBPS Official', type: 'syllabus', url: 'https://www.ibps.in', description: 'IBPS PO, Clerk, RRB exam information', examBoard: 'IBPS', free: true },
    { name: 'SBI Careers', type: 'syllabus', url: 'https://sbi.co.in/careers', description: 'SBI PO and Clerk exam official notifications', examBoard: 'SBI', free: true },
    { name: 'SSC Official', type: 'syllabus', url: 'https://ssc.nic.in', description: 'SSC CGL, CHSL, MTS syllabus and papers', examBoard: 'SSC', free: true },
    { name: 'RRB Official', type: 'syllabus', url: 'https://www.rrbcdg.gov.in', description: 'Railway Recruitment Board exam info', examBoard: 'RRB', free: true },
  ],
  sat_gre: [
    { name: 'College Board SAT Resources', type: 'study_material', url: 'https://satsuite.collegeboard.org/sat/practice-preparation', description: 'Official SAT practice tests and prep', examBoard: 'College Board', free: true },
    { name: 'ETS GRE Resources', type: 'study_material', url: 'https://www.ets.org/gre/revised_general/prepare', description: 'Official GRE preparation materials', examBoard: 'ETS', free: true },
    { name: 'GMAC GMAT Prep', type: 'study_material', url: 'https://www.mba.com/exams/gmat', description: 'Official GMAT preparation resources', examBoard: 'GMAC', free: true },
  ],
  ielts_toefl: [
    { name: 'British Council IELTS Prep', type: 'study_material', url: 'https://www.britishcouncil.org/exam/ielts/preparation', description: 'Free IELTS preparation materials from British Council', examBoard: 'British Council', free: true },
    { name: 'IELTS Official Practice Materials', type: 'mock_test', url: 'https://www.ielts.org/usa/ielts-for-test-takers/how-to-prepare', description: 'Official IELTS practice tests', examBoard: 'IELTS', free: true },
    { name: 'ETS TOEFL Resources', type: 'study_material', url: 'https://www.ets.org/toefl/test-takers/ibt/prepare', description: 'Official TOEFL iBT preparation', examBoard: 'ETS', free: true },
  ],
}

const EXAM_KEYWORD_MAP: Record<string, string[]> = {
  upsc_ias: ['upsc', 'ias', 'ips', 'civil services', 'prelims', 'mains', 'general studies', 'csat', 'lbsnaa', 'ifs officer'],
  jee: ['jee', 'jee main', 'jee advanced', 'iit', 'nit', 'engineering entrance', 'bitsat', 'pcm entrance'],
  neet: ['neet', 'medical entrance', 'mbbs entrance', 'aiims', 'pcb entrance', 'neet ug'],
  ca: ['ca foundation', 'ca intermediate', 'ca final', 'chartered accountant', 'icai', 'articleship', 'ca exam'],
  cma: ['cma', 'cost accountant', 'icmai', 'cma foundation', 'cma intermediate'],
  cs: ['company secretary', 'cs foundation', 'cs executive', 'cs professional', 'icsi'],
  gate: ['gate exam', 'gate preparation', 'gate cse', 'gate ece', 'gate me', 'psu through gate'],
  banking_ssc: ['ibps', 'sbi po', 'sbi clerk', 'ssc cgl', 'ssc chsl', 'rrb', 'banking exam', 'rbi grade b'],
  sat_gre: ['sat exam', 'gre exam', 'gmat', 'us college', 'grad school admission'],
  ielts_toefl: ['ielts', 'toefl', 'pte', 'english proficiency', 'band score', 'toefl ibt'],
}

export function findExamResources(topic: string): ExamResource[] {
  const lower = topic.toLowerCase()
  const results: ExamResource[] = []

  for (const [examKey, keywords] of Object.entries(EXAM_KEYWORD_MAP)) {
    if (keywords.some(k => lower.includes(k))) {
      const resources = EXAM_RESOURCES[examKey] || []
      results.push(...resources.slice(0, 3))
    }
  }

  return results.slice(0, 6)
}