import { Notice, SearchResult, ConflictRecord, ChatMessageCitation } from '../types';

/**
 * Tokenize string and normalize keywords
 */
export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'with', 'from', 'that', 'this', 'have', 'has', 'was', 'were',
  'will', 'what', 'when', 'where', 'which', 'who', 'how', 'can', 'could', 'should', 'would',
  'about', 'into', 'after', 'before', 'then', 'than', 'them', 'their', 'there', 'they',
  'any', 'some', 'out', 'over', 'under', 'such', 'only', 'also', 'just', 'been', 'being',
  'please', 'find', 'give', 'tell', 'show', 'know', 'want', 'need', 'is', 'in', 'at', 'on', 'to', 'of'
]);

/**
 * Split text into semantic passages (paragraphs / sections)
 */
export function extractPassages(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.replace(/[#*`]/g, '').trim())
    .filter((p) => p.length > 20);
}

/**
 * Score notice against a user query using evidence-backed semantic scoring
 */
export function searchNotices(query: string, notices: Notice[]): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const queryKeywords = extractKeywords(trimmed);
  if (queryKeywords.length === 0 && trimmed.length < 2) return [];

  // Filter only published notices for student search
  const publishedNotices = notices.filter((n) => n.status === 'published');
  const results: SearchResult[] = [];

  for (const notice of publishedNotices) {
    let score = 0;
    const titleLower = notice.title.toLowerCase();
    const summaryLower = notice.summary.toLowerCase();
    const contentLower = notice.content.toLowerCase();
    const categoryLower = notice.category.toLowerCase();
    const tagsLower = notice.tags.map((t) => t.toLowerCase());

    const matchedWords: string[] = [];

    // Exact phrase match bonus
    if (titleLower.includes(trimmed)) score += 60;
    if (summaryLower.includes(trimmed)) score += 40;
    if (contentLower.includes(trimmed)) score += 30;

    // Category match bonus
    if (categoryLower.includes(trimmed) || trimmed.includes(categoryLower)) {
      score += 25;
      matchedWords.push(notice.category);
    }

    // Keyword overlap matching
    for (const kw of queryKeywords) {
      if (titleLower.includes(kw)) {
        score += 20;
        matchedWords.push(kw);
      }
      if (summaryLower.includes(kw)) {
        score += 12;
        matchedWords.push(kw);
      }
      if (contentLower.includes(kw)) {
        score += 8;
        matchedWords.push(kw);
      }
      if (tagsLower.some((t) => t.includes(kw))) {
        score += 15;
        matchedWords.push(kw);
      }
      // Check event metadata
      if (notice.hasEvent && notice.eventData) {
        if (notice.eventData.venue.toLowerCase().includes(kw)) {
          score += 14;
          matchedWords.push(kw);
        }
        if (notice.eventData.organizer.toLowerCase().includes(kw)) {
          score += 10;
          matchedWords.push(kw);
        }
      }
    }

    if (notice.isImportant) score += 5;

    // Passage retrieval & Match reasoning
    if (score > 10) {
      const passages = extractPassages(notice.content);
      let bestPassage = notice.summary;
      let highestPassageScore = 0;

      for (const p of passages) {
        let pScore = 0;
        const pLower = p.toLowerCase();
        for (const kw of queryKeywords) {
          if (pLower.includes(kw)) pScore += 1;
        }
        if (pScore > highestPassageScore) {
          highestPassageScore = pScore;
          bestPassage = p;
        }
      }

      // Construct explainable match reason
      let matchReason = 'Matched query keywords in notice text.';
      if (queryKeywords.some((k) => ['venue', 'where', 'location', 'hall', 'room'].includes(k)) && notice.eventData?.venue) {
        matchReason = `Matched venue information: "${notice.eventData.venue}"`;
      } else if (queryKeywords.some((k) => ['deadline', 'last date', 'when', 'date', 'time', 'schedule'].includes(k))) {
        matchReason = `Matched schedule & deadline timeline in official notice.`;
      } else if (queryKeywords.some((k) => ['fee', 'payment', 'tuition', 'scholarship', 'cost', 'fine'].includes(k))) {
        matchReason = `Matched financial & fee regulations passage.`;
      } else if (queryKeywords.some((k) => ['eligibility', 'cgpa', 'cutoff', 'criteria', 'who can apply'].includes(k))) {
        matchReason = `Matched academic & eligibility criteria section.`;
      } else if (notice.isRevised) {
        matchReason = `Matched latest official revision (${notice.currentVersion}).`;
      }

      // Check if notice has revision conflicts with user query
      let isConflicted = false;
      let conflictDetails;
      if (notice.isRevised && notice.revisions.length > 0) {
        const latestRev = notice.revisions[notice.revisions.length - 1];
        isConflicted = true;
        conflictDetails = {
          conflictType: latestRev.changedFields.join(', '),
          conflictDescription: latestRev.changeSummary,
        };
      }

      results.push({
        notice,
        relevanceScore: score,
        matchedPassage: bestPassage,
        matchReason,
        highlightWords: Array.from(new Set(matchedWords)),
        isConflicted,
        conflictDetails,
      });
    }
  }

  // Sort by highest relevance score
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Deep Conflict Detection Engine
 * Discovers discrepancies across multiple notices or notice revisions
 */
export function detectConflicts(notices: Notice[]): ConflictRecord[] {
  const published = notices.filter((n) => n.status === 'published');
  const records: ConflictRecord[] = [];

  for (const notice of published) {
    if (notice.isRevised && notice.revisions.length > 0) {
      for (const rev of notice.revisions) {
        const changedFields = rev.changedFields;
        let conflictType: ConflictRecord['conflictType'] = 'Instructions';
        if (changedFields.some((f) => f.includes('venue') || f.includes('location'))) {
          conflictType = 'Venues';
        } else if (changedFields.some((f) => f.includes('date') || f.includes('schedule') || f.includes('time'))) {
          conflictType = 'Dates';
        } else if (changedFields.some((f) => f.includes('deadline'))) {
          conflictType = 'Deadlines';
        } else if (changedFields.some((f) => f.includes('eligibility') || f.includes('cutoff'))) {
          conflictType = 'Eligibility';
        }

        records.push({
          id: `conflict-${notice.id}-${rev.id}`,
          topic: notice.title,
          conflictType,
          notices: [
            {
              notice,
              passage: rev.previousSnapshot.content || rev.previousSnapshot.summary,
              date: rev.editedAt,
              version: rev.version,
              isLatest: false,
              instructionType: 'Original instruction',
            },
            {
              notice,
              passage: rev.currentSnapshot.content || rev.currentSnapshot.summary,
              date: notice.updatedAt,
              version: notice.currentVersion,
              isLatest: true,
              instructionType: 'Latest published revision',
            },
          ],
          explanation: `Multiple versions of notice "${notice.title}" contain differing information: ${rev.changeSummary}`,
          advice: `Please adhere to the Latest published revision (${notice.currentVersion}) issued on ${new Date(notice.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
        });
      }
    }
  }

  return records;
}

/**
 * AI Campus Assistant Response Synthesizer
 * Evidence-first retrieval with zero hallucination.
 */
export function generateAIAnswer(
  query: string,
  notices: Notice[]
): {
  answer: string;
  citations: ChatMessageCitation[];
  conflictAlert?: {
    title: string;
    details: string;
    chronology: { noticeTitle: string; noticeNumber: string; date: string; info: string; isLatest: boolean }[];
  };
  suggestedFollowUps: string[];
} {
  const searchResults = searchNotices(query, notices);

  if (searchResults.length === 0) {
    return {
      answer: 'No matching information found in the available campus notices.\n\nAntigravity retrieval policy strictly prohibits generating responses without official published documentation. If you believe this notice should exist, please contact the campus administrator.',
      citations: [],
      suggestedFollowUps: [
        'Check Autumn 2026 Mid-Semester timetable',
        'Find upcoming Hackathons and coding contests',
        'What is the last date for semester fee payment?',
      ],
    };
  }

  const topResult = searchResults[0];
  const topNotice = topResult.notice;

  // Build strict citation
  const citations: ChatMessageCitation[] = searchResults.slice(0, 3).map((res) => ({
    noticeId: res.notice.id,
    noticeNumber: res.notice.noticeNumber,
    title: res.notice.title,
    category: res.notice.category,
    publishedDate: res.notice.updatedAt || res.notice.publishedAt,
    isRevised: res.notice.isRevised,
    passage: res.matchedPassage,
  }));

  // Build factual, verified answer from matched passages
  let answer = `According to official notice **${topNotice.noticeNumber}** (*"${topNotice.title}"*):\n\n`;

  if (topNotice.isRevised) {
    answer += `> ⚠️ **Notice Revision Update**: This notice was officially updated to **${topNotice.currentVersion}** on ${new Date(topNotice.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.\n\n`;
  }

  answer += `${topResult.matchedPassage}\n\n`;

  if (topNotice.hasEvent && topNotice.eventData) {
    answer += `**Key Event & Schedule Details:**\n`;
    answer += `- 📍 **Venue**: ${topNotice.eventData.venue}\n`;
    answer += `- 🗓️ **Date & Time**: ${topNotice.eventData.eventDate} (${topNotice.eventData.eventTime})\n`;
    if (topNotice.eventData.registrationDeadline) {
      answer += `- ⏳ **Registration Deadline**: ${topNotice.eventData.registrationDeadline}\n`;
    }
    if (topNotice.eventData.organizer) {
      answer += `- 🏛️ **Organizer**: ${topNotice.eventData.organizer}\n`;
    }
  }

  // Check for conflict alert
  let conflictAlert;
  if (topNotice.isRevised && topNotice.revisions.length > 0) {
    const rev = topNotice.revisions[0];
    conflictAlert = {
      title: 'Revision & Discrepancy Notice Detected',
      details: rev.changeSummary,
      chronology: [
        {
          noticeTitle: topNotice.title,
          noticeNumber: topNotice.noticeNumber,
          date: new Date(rev.editedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          info: rev.previousSnapshot.venue ? `Original Venue: ${rev.previousSnapshot.venue}` : rev.previousSnapshot.summary,
          isLatest: false,
        },
        {
          noticeTitle: topNotice.title,
          noticeNumber: topNotice.noticeNumber,
          date: new Date(topNotice.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          info: rev.currentSnapshot.venue ? `Revised Venue: ${rev.currentSnapshot.venue}` : rev.currentSnapshot.summary,
          isLatest: true,
        },
      ],
    };
  }

  // Dynamic relevant follow-up questions
  const followUps: string[] = [];
  if (topNotice.category === 'Hackathons') {
    followUps.push('What are the HackNova team size and eligibility rules?');
    followUps.push('What are the prize tracks for HackNova 2026?');
  } else if (topNotice.category === 'Exams') {
    followUps.push('What is the minimum attendance requirement for exams?');
    followUps.push('What items are prohibited in the exam halls?');
  } else if (topNotice.category === 'Placements') {
    followUps.push('What is the CGPA eligibility cutoff for Google & Microsoft?');
    followUps.push('When will the online coding assessment be held?');
  } else if (topNotice.category === 'Registration') {
    followUps.push('What are the accepted payment modes for semester fees?');
    followUps.push('Is there any late fee penalty after October 10?');
  } else {
    followUps.push(`Show all notices under ${topNotice.category}`);
    followUps.push('Are there any other recent announcements?');
  }

  return {
    answer,
    citations,
    conflictAlert,
    suggestedFollowUps: followUps,
  };
}
