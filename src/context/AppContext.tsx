import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Notice,
  NoticeCategory,
  CampusEvent,
  AppNotification,
  SearchQueryLog,
  NoticeRevision,
} from '../types';
import {
  INITIAL_NOTICES,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SEARCH_LOGS,
} from '../data/mockNotices';

const CATEGORIES_LIST: { name: NoticeCategory; isActive: boolean; description: string }[] = [
  { name: 'Hackathons', isActive: true, description: 'Coding marathons, tech sprints, and project competitions.' },
  { name: 'Workshops', isActive: true, description: 'Technical bootcamps, hands-on masterclasses, and skill sessions.' },
  { name: 'Placements', isActive: true, description: 'On-campus recruitment drives, job circulars, and interviews.' },
  { name: 'Internships', isActive: true, description: 'Summer internships, industrial training, and research fellowships.' },
  { name: 'Exams', isActive: true, description: 'Mid-sem, end-sem schedules, hall tickets, and seating rosters.' },
  { name: 'Scholarships', isActive: true, description: 'Tuition fee waivers, merit-cum-means grants, and financial aid.' },
  { name: 'Registration', isActive: true, description: 'Course enrollment, fee payment deadlines, and ERP procedures.' },
  { name: 'Clubs & Societies', isActive: true, description: 'Student clubs, society auditions, cultural events, and fests.' },
  { name: 'Events', isActive: true, description: 'Guest lectures, cultural fests, sports meets, and conferences.' },
  { name: 'Academic', isActive: true, description: 'Curriculum updates, attendance rules, and academic calendars.' },
  { name: 'Announcements', isActive: true, description: 'General campus alerts, library hours, transport, and hostels.' },
  { name: 'Other', isActive: true, description: 'General notices and administrative circulars.' },
];

interface AppContextType {
  currentUser: User | null;
  role: Role | 'guest';
  loginAs: (role: Role) => void;
  loginWithCredentials: (email: string, role: Role, name?: string) => void;
  signupStudent: (data: { name: string; email: string; studentId: string; department: string }) => void;
  logout: () => void;

  notices: Notice[];
  publishedNotices: Notice[];
  createNotice: (data: Partial<Notice>) => Notice;
  updateNotice: (id: string, updatedFields: Partial<Notice>, changeSummary: string) => Notice | null;
  deleteNotice: (id: string) => void;
  archiveNotice: (id: string) => void;
  publishDraftNotice: (id: string) => void;
  duplicateNotice: (id: string) => void;

  bookmarks: string[];
  toggleBookmark: (noticeId: string) => void;
  isBookmarked: (noticeId: string) => boolean;

  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  searchLogs: SearchQueryLog[];
  logSearchQuery: (query: string, resultsCount: number, matchedCategory: NoticeCategory | 'None', matchedNoticeIds: string[], wasAnswered: boolean) => void;

  categories: typeof CATEGORIES_LIST;
  toggleCategoryStatus: (name: NoticeCategory) => void;
  addCategory: (name: string, description: string) => void;

  users: User[];
  toggleUserStatus: (userId: string) => void;

  events: CampusEvent[];
  recentlyViewedIds: string[];
  recordNoticeView: (noticeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or fallbacks
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cp_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // Default student user for smooth instant preview
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('cp_notices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTICES;
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('cp_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['notice-001', 'notice-002', 'notice-003'];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cp_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [searchLogs, setSearchLogs] = useState<SearchQueryLog[]>(() => {
    const saved = localStorage.getItem('cp_search_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SEARCH_LOGS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cp_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [categories, setCategories] = useState(CATEGORIES_LIST);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(['notice-001', 'notice-002']);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('cp_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cp_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('cp_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('cp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cp_search_logs', JSON.stringify(searchLogs));
  }, [searchLogs]);

  useEffect(() => {
    localStorage.setItem('cp_users_list', JSON.stringify(users));
  }, [users]);

  // Auth Helpers
  const loginAs = (role: Role) => {
    const targetUser = users.find((u) => u.role === role) || (role === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0]);
    setCurrentUser(targetUser);
  };

  const loginWithCredentials = (email: string, role: Role, name?: string) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name || (role === 'admin' ? 'Campus Administrator' : email.split('@')[0]),
        email,
        role,
        department: role === 'admin' ? 'University Administration' : 'General Engineering',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
    }
  };

  const signupStudent = (data: { name: string; email: string; studentId: string; department: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      studentId: data.studentId,
      department: data.department,
      createdAt: new Date().toISOString(),
      status: 'active',
      savedNoticesCount: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Notice CRUD
  const publishedNotices = notices.filter((n) => n.status === 'published');

  const createNotice = (data: Partial<Notice>): Notice => {
    const noticeCount = notices.length + 1;
    const padNum = String(noticeCount).padStart(4, '0');
    const noticeNumber = `CP-2026-${padNum}`;

    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      noticeNumber,
      title: data.title || 'Untitled Notice',
      summary: data.summary || '',
      content: data.content || '',
      category: data.category || 'Announcements',
      tags: data.tags || [],
      author: data.author || {
        name: currentUser?.name || 'Administrator',
        department: currentUser?.department || 'Administration',
        email: currentUser?.email || 'admin@campus.edu',
      },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: data.status || 'published',
      isImportant: Boolean(data.isImportant),
      isRevised: false,
      currentVersion: 'v1.0',
      hasEvent: Boolean(data.hasEvent),
      eventData: data.eventData,
      attachments: data.attachments || [],
      revisions: [],
      viewCount: 0,
      bookmarkCount: 0,
    };

    setNotices((prev) => [newNotice, ...prev]);

    // If important and published, notify all students
    if (newNotice.isImportant && newNotice.status === 'published') {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Important Notice: ${newNotice.title}`,
        message: newNotice.summary || `A new important notice has been posted under ${newNotice.category}.`,
        type: 'important',
        targetNoticeId: newNotice.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return newNotice;
  };

  const updateNotice = (id: string, updatedFields: Partial<Notice>, changeSummary: string): Notice | null => {
    const existing = notices.find((n) => n.id === id);
    if (!existing) return null;

    const oldVersionNum = parseFloat(existing.currentVersion.replace('v', '')) || 1.0;
    const newVersion = `v${(oldVersionNum + 0.1).toFixed(1)}`;

    const changedKeys = Object.keys(updatedFields).filter(
      (k) => (updatedFields as any)[k] !== (existing as any)[k]
    );

    const revision: NoticeRevision = {
      id: `rev-${Date.now()}`,
      version: existing.currentVersion,
      editedAt: new Date().toISOString(),
      editedBy: currentUser?.name || 'Campus Administrator',
      editorRole: currentUser?.role || 'admin',
      changeSummary: changeSummary || 'Updated notice details and parameters.',
      changedFields: changedKeys,
      previousSnapshot: {
        title: existing.title,
        content: existing.content,
        summary: existing.summary,
        category: existing.category,
        isImportant: existing.isImportant,
        eventDate: existing.eventData?.eventDate,
        eventTime: existing.eventData?.eventTime,
        venue: existing.eventData?.venue,
        registrationDeadline: existing.eventData?.registrationDeadline,
        registrationUrl: existing.eventData?.registrationUrl,
      },
      currentSnapshot: {
        title: updatedFields.title || existing.title,
        content: updatedFields.content || existing.content,
        summary: updatedFields.summary || existing.summary,
        category: updatedFields.category || existing.category,
        isImportant: updatedFields.isImportant !== undefined ? updatedFields.isImportant : existing.isImportant,
        eventDate: updatedFields.eventData?.eventDate || existing.eventData?.eventDate,
        eventTime: updatedFields.eventData?.eventTime || existing.eventData?.eventTime,
        venue: updatedFields.eventData?.venue || existing.eventData?.venue,
        registrationDeadline: updatedFields.eventData?.registrationDeadline || existing.eventData?.registrationDeadline,
        registrationUrl: updatedFields.eventData?.registrationUrl || existing.eventData?.registrationUrl,
      },
    };

    const updatedNotice: Notice = {
      ...existing,
      ...updatedFields,
      isRevised: true,
      currentVersion: newVersion,
      updatedAt: new Date().toISOString(),
      revisions: [revision, ...(existing.revisions || [])],
    };

    setNotices((prev) => prev.map((n) => (n.id === id ? updatedNotice : n)));

    // Create in-app notification if bookmarked
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Notice Revised: ${updatedNotice.title}`,
      message: changeSummary || `Important updates have been made to notice #${updatedNotice.noticeNumber}.`,
      type: 'revision',
      targetNoticeId: updatedNotice.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return updatedNotice;
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const archiveNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'archived', updatedAt: new Date().toISOString() } : n))
    );
  };

  const publishDraftNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: 'published', publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : n
      )
    );
  };

  const duplicateNotice = (id: string) => {
    const existing = notices.find((n) => n.id === id);
    if (!existing) return;
    createNotice({
      ...existing,
      title: `${existing.title} (Copy)`,
      status: 'draft',
      isRevised: false,
      currentVersion: 'v1.0',
      revisions: [],
    });
  };

  // Bookmarks
  const toggleBookmark = (noticeId: string) => {
    setBookmarks((prev) => {
      const isAlready = prev.includes(noticeId);
      const next = isAlready ? prev.filter((id) => id !== noticeId) : [...prev, noticeId];
      // Update notice bookmark count
      setNotices((nList) =>
        nList.map((n) => (n.id === noticeId ? { ...n, bookmarkCount: Math.max(0, n.bookmarkCount + (isAlready ? -1 : 1)) } : n))
      );
      return next;
    });
  };

  const isBookmarked = (noticeId: string) => bookmarks.includes(noticeId);

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Search Logging for Admin Analytics
  const logSearchQuery = (
    query: string,
    resultsCount: number,
    matchedCategory: NoticeCategory | 'None',
    matchedNoticeIds: string[],
    wasAnswered: boolean
  ) => {
    const log: SearchQueryLog = {
      id: `log-${Date.now()}`,
      query,
      timestamp: new Date().toISOString(),
      resultsCount,
      matchedCategory,
      matchedNoticeIds,
      wasAnswered,
      userRole: currentUser?.role || 'guest',
    };
    setSearchLogs((prev) => [log, ...prev]);
  };

  // Category Management
  const toggleCategoryStatus = (name: NoticeCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const addCategory = (name: string, description: string) => {
    setCategories((prev) => [
      ...prev,
      { name: name as NoticeCategory, isActive: true, description },
    ]);
  };

  // User Management
  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    );
  };

  // Record Notice View
  const recordNoticeView = (noticeId: string) => {
    setRecentlyViewedIds((prev) => [noticeId, ...prev.filter((id) => id !== noticeId)].slice(0, 10));
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, viewCount: n.viewCount + 1 } : n))
    );
  };

  // Auto-generate Events from Notices
  const events: CampusEvent[] = notices
    .filter((n) => n.hasEvent && n.eventData && n.status === 'published')
    .map((n) => ({
      id: `evt-${n.id}`,
      noticeId: n.id,
      noticeNumber: n.noticeNumber,
      title: n.title,
      category: n.category,
      eventDate: n.eventData!.eventDate,
      eventTime: n.eventData!.eventTime,
      venue: n.eventData!.venue,
      organizer: n.eventData!.organizer,
      registrationDeadline: n.eventData!.registrationDeadline,
      registrationUrl: n.eventData!.registrationUrl,
      shortDescription: n.summary,
      status: n.eventData!.status || 'upcoming',
      isImportant: n.isImportant,
      isRevised: n.isRevised,
      bookmarkCount: n.bookmarkCount,
      maxParticipants: n.eventData!.maxParticipants,
      currentRegistrations: n.eventData!.currentRegistrations,
    }))
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'guest',
        loginAs,
        loginWithCredentials,
        signupStudent,
        logout,
        notices,
        publishedNotices,
        createNotice,
        updateNotice,
        deleteNotice,
        archiveNotice,
        publishDraftNotice,
        duplicateNotice,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        searchLogs,
        logSearchQuery,
        categories,
        toggleCategoryStatus,
        addCategory,
        users,
        toggleUserStatus,
        events,
        recentlyViewedIds,
        recordNoticeView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
