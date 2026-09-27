export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  department?: string;
  studentId?: string;
  enrollmentYear?: string;
  savedNoticesCount?: number;
  lastActive?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export type NoticeCategory =
  | 'Events'
  | 'Workshops'
  | 'Hackathons'
  | 'Placements'
  | 'Internships'
  | 'Exams'
  | 'Registration'
  | 'Clubs & Societies'
  | 'Scholarships'
  | 'Academic'
  | 'Announcements'
  | 'Other';

export type NoticeStatus = 'published' | 'draft' | 'archived' | 'expired';

export type EventStatus =
  | 'upcoming'
  | 'registration_open'
  | 'registration_closing_soon'
  | 'today'
  | 'completed'
  | 'cancelled';

export interface NoticeAttachment {
  id: string;
  name: string;
  size: string;
  type: string; // 'pdf' | 'docx' | 'image' | 'file'
  url?: string;
  extractedText?: string;
}

export interface NoticeRevision {
  id: string;
  version: string; // e.g. "v1.0", "v1.1", "v2.0"
  editedAt: string;
  editedBy: string;
  editorRole: string;
  changeSummary: string;
  changedFields: string[]; // ['venue', 'content', 'registrationDeadline', etc.]
  previousSnapshot: {
    title: string;
    content: string;
    summary: string;
    category: NoticeCategory;
    isImportant: boolean;
    eventDate?: string;
    eventTime?: string;
    venue?: string;
    registrationDeadline?: string;
    registrationUrl?: string;
  };
  currentSnapshot: {
    title: string;
    content: string;
    summary: string;
    category: NoticeCategory;
    isImportant: boolean;
    eventDate?: string;
    eventTime?: string;
    venue?: string;
    registrationDeadline?: string;
    registrationUrl?: string;
  };
}

export interface EventData {
  eventDate: string; // ISO date string or YYYY-MM-DD
  eventTime: string; // e.g. "10:00 AM - 04:00 PM"
  venue: string;
  organizer: string;
  registrationDeadline?: string;
  registrationUrl?: string;
  maxParticipants?: number;
  currentRegistrations?: number;
  status: EventStatus;
}

export interface Notice {
  id: string;
  noticeNumber: string; // e.g. "CP-2026-0042"
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  tags: string[];
  author: {
    name: string;
    department: string;
    email: string;
  };
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  status: NoticeStatus;
  isImportant: boolean;
  isRevised: boolean;
  currentVersion: string;
  hasEvent: boolean;
  eventData?: EventData;
  attachments: NoticeAttachment[];
  revisions: NoticeRevision[];
  viewCount: number;
  bookmarkCount: number;
  relatedNoticeIds?: string[];
}

export interface CampusEvent {
  id: string;
  noticeId: string;
  noticeNumber: string;
  title: string;
  category: NoticeCategory;
  eventDate: string;
  eventTime: string;
  venue: string;
  organizer: string;
  registrationDeadline?: string;
  registrationUrl?: string;
  shortDescription: string;
  status: EventStatus;
  isImportant: boolean;
  isRevised: boolean;
  bookmarkCount: number;
  maxParticipants?: number;
  currentRegistrations?: number;
}

export interface SearchResult {
  notice: Notice;
  relevanceScore: number;
  matchedPassage: string;
  matchReason: string;
  highlightWords: string[];
  isConflicted?: boolean;
  conflictDetails?: {
    conflictType: string;
    conflictDescription: string;
    conflictingNotice?: Notice;
  };
}

export interface ConflictRecord {
  id: string;
  topic: string;
  conflictType: 'Dates' | 'Deadlines' | 'Venues' | 'Eligibility' | 'Registration' | 'Timings' | 'Instructions';
  notices: {
    notice: Notice;
    passage: string;
    date: string;
    version: string;
    isLatest: boolean;
    instructionType: 'Original instruction' | 'Revised instruction' | 'Latest published revision';
  }[];
  explanation: string;
  advice: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'revision' | 'important' | 'deadline' | 'new_notice' | 'event_update';
  targetNoticeId?: string;
  targetEventId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SearchQueryLog {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  matchedCategory?: NoticeCategory | 'None';
  matchedNoticeIds: string[];
  wasAnswered: boolean;
  userRole: 'student' | 'admin' | 'guest';
}

export interface ChatMessageCitation {
  noticeId: string;
  noticeNumber: string;
  title: string;
  category: NoticeCategory;
  publishedDate: string;
  isRevised: boolean;
  passage: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: ChatMessageCitation[];
  conflictAlert?: {
    title: string;
    details: string;
    chronology: { noticeTitle: string; noticeNumber: string; date: string; info: string; isLatest: boolean }[];
  };
  suggestedFollowUps?: string[];
}

export interface CategoryStat {
  name: NoticeCategory;
  count: number;
  iconName: string;
  color: string;
  description: string;
  isActive: boolean;
}
