import { NoticeCategory } from '../types';

interface CategoryMatch {
  category: NoticeCategory;
  score: number;
  matchedKeywords: string[];
}

const CATEGORY_RULES: Record<NoticeCategory, string[]> = {
  Hackathons: ['hackathon', 'hacknova', 'coding contest', 'codefest', 'problem statement', '36-hour', 'prize pool', 'devpost', 'gdsc'],
  Workshops: ['workshop', 'hands-on', 'bootcamp', 'training', 'session', 'turing lab', 'tutorial', 'seminar', 'masterclass', 'certification'],
  Placements: ['placement', 'recruitment', 'job', 'salary', 'ctc', 'sde', 'interview', 'hiring', 'shortlist', 'cdpc', 'superset', 'package', 'cgpa cutoff'],
  Internships: ['internship', 'summer intern', 'stipend', 'research intern', 'industry project', 'trainee'],
  Exams: ['exam', 'midterm', 'mid-semester', 'end-semester', 'hall ticket', 'admit card', 'timetable', 'coe', 'controller of examination', 're-evaluation', 'seating'],
  Scholarships: ['scholarship', 'financial aid', 'fee waiver', 'merit-cum-means', 'fellowship', 'stipend', 'income certificate', 'grant', 'tuition waiver'],
  Registration: ['registration', 'fee payment', 'tuition fee', 'enrollment', 'course add drop', 'semester fee', 'portal registration', 'fine', 'accounts'],
  'Clubs & Societies': ['club', 'society', 'audition', 'induction', 'recruitment', 'robotics', 'music', 'dance', 'drama', 'debate', 'urac', 'student chapter'],
  Events: ['event', 'fest', 'annual day', 'cultural', 'sports', 'symposium', 'guest lecture', 'inauguration', 'ceremony', 'meet'],
  Academic: ['academic calendar', 'syllabus', 'curriculum', 'attendance', 'lecture timing', 'faculty', 'grade', 'credit', 'cgpa'],
  Announcements: ['announcement', 'notice', 'library', 'hostel', 'canteen', 'transport', 'wifi', 'holiday', 'circular', 'maintenance', 'gate pass'],
  Other: ['miscellaneous', 'general', 'lost and found'],
};

/**
 * Classifies content and suggests the most relevant category automatically
 */
export function classifyNoticeContent(
  title: string,
  content: string
): {
  suggestedCategory: NoticeCategory;
  confidence: number;
  reasons: string[];
} {
  const combined = `${title} ${content}`.toLowerCase();
  const results: CategoryMatch[] = [];

  for (const [cat, keywords] of Object.entries(CATEGORY_RULES) as [NoticeCategory, string[]][]) {
    let score = 0;
    const matched: string[] = [];

    for (const kw of keywords) {
      if (title.toLowerCase().includes(kw)) {
        score += 5;
        matched.push(kw);
      } else if (combined.includes(kw)) {
        score += 2;
        matched.push(kw);
      }
    }

    if (score > 0) {
      results.push({
        category: cat,
        score,
        matchedKeywords: matched,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return {
      suggestedCategory: 'Announcements',
      confidence: 40,
      reasons: ['Default category applied based on general content.'],
    };
  }

  const top = results[0];
  const confidence = Math.min(Math.round((top.score / (top.score + 5)) * 100), 98);

  return {
    suggestedCategory: top.category,
    confidence,
    reasons: top.matchedKeywords.map((k) => `Detected keyword: "${k}"`),
  };
}
