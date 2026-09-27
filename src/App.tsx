import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { NoticesPage } from './pages/NoticesPage';
import { EventsPage } from './pages/EventsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminNoticesPage } from './pages/AdminNoticesPage';
import { AdminCreateEditNoticePage } from './pages/AdminCreateEditNoticePage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminSearchAnalyticsPage } from './pages/AdminSearchAnalyticsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AuthModal } from './components/AuthModal';
import { Notice, CampusEvent } from './types';
import { Home, FileText, Calendar, Sparkles, Bookmark, Shield, User } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, role, publishedNotices, notices } = useApp();
  const { showToast } = useToast();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    return role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
  });

  // Modals state
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [highlightPassage, setHighlightPassage] = useState<string | undefined>();
  const [registeringEvent, setRegisteringEvent] = useState<CampusEvent | Notice | null>(null);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authRole, setAuthRole] = useState<'student' | 'admin'>('student');
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Sync tab on role switch
  useEffect(() => {
    if (role === 'admin' && !activeTab.startsWith('admin-')) {
      setActiveTab('admin-dashboard');
    } else if (role === 'student' && activeTab.startsWith('admin-')) {
      setActiveTab('student-dashboard');
    }
  }, [role]);

  // Open Notice Modal Handler
  const handleOpenNotice = (notice: Notice, passage?: string) => {
    setSelectedNotice(notice);
    setHighlightPassage(passage);
  };

  const handleOpenNoticeById = (id: string) => {
    const n = notices.find((item) => item.id === id);
    if (n) {
      setSelectedNotice(n);
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setActiveTab('admin-edit');
  };

  const handleCreateNotice = () => {
    setEditingNotice(null);
    setActiveTab('admin-create');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login', targetRole: 'student' | 'admin' = 'student') => {
    setAuthMode(mode);
    setAuthRole(targetRole);
    setIsAuthModalOpen(true);
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onOpenNotice={handleOpenNotice}
            onNavigate={setActiveTab}
            onOpenAuth={handleOpenAuth}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboard
            onOpenNotice={handleOpenNotice}
            onNavigate={setActiveTab}
            onOpenRegisterEvent={(evt) => setRegisteringEvent(evt)}
          />
        );

      case 'notices':
        return <NoticesPage onOpenNotice={handleOpenNotice} />;

      case 'events':
        return (
          <EventsPage
            onOpenNotice={handleOpenNoticeById}
            onRegisterEvent={(evt) => setRegisteringEvent(evt)}
          />
        );

      case 'assistant':
        return <AIAssistantPage onOpenNotice={handleOpenNotice} />;

      case 'bookmarks':
        return (
          <BookmarksPage
            onOpenNotice={handleOpenNotice}
            onRegisterEvent={(evt) => setRegisteringEvent(evt)}
          />
        );

      case 'notifications':
        return <NotificationsPage onOpenNotice={handleOpenNotice} />;

      // Admin Pages
      case 'admin-dashboard':
        if (role !== 'admin') {
          return (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <h2>Admin Access Required</h2>
              <button className="btn btn-primary" onClick={() => handleOpenAuth('login', 'admin')}>
                Sign In as Admin
              </button>
            </div>
          );
        }
        return (
          <AdminDashboard
            onNavigate={setActiveTab}
            onOpenNotice={handleOpenNotice}
            onEditNotice={handleEditNotice}
          />
        );

      case 'admin-notices':
        return (
          <AdminNoticesPage
            onOpenNotice={handleOpenNotice}
            onEditNotice={handleEditNotice}
            onCreateNotice={handleCreateNotice}
          />
        );

      case 'admin-create':
        return (
          <AdminCreateEditNoticePage
            editingNotice={null}
            onNavigate={setActiveTab}
            onSuccess={() => setActiveTab('admin-notices')}
          />
        );

      case 'admin-edit':
        return (
          <AdminCreateEditNoticePage
            editingNotice={editingNotice}
            onNavigate={setActiveTab}
            onSuccess={() => setActiveTab('admin-notices')}
          />
        );

      case 'admin-events':
        return (
          <AdminEventsPage
            onNavigate={setActiveTab}
            onOpenNotice={handleOpenNoticeById}
          />
        );

      case 'admin-categories':
        return <AdminCategoriesPage />;

      case 'admin-analytics':
        return <AdminSearchAnalyticsPage onNavigate={setActiveTab} />;

      case 'admin-users':
        return <AdminUsersPage />;

      default:
        return (
          <StudentDashboard
            onOpenNotice={handleOpenNotice}
            onNavigate={setActiveTab}
            onOpenRegisterEvent={(evt) => setRegisteringEvent(evt)}
          />
        );
    }
  };

  return (
    <div className="app-content-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onOpenNoticeDetail={handleOpenNoticeById}
      />

      {/* Main Render View */}
      <main style={{ flex: 1 }}>{renderCurrentPage()}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {role === 'admin' ? (
          <>
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'admin-dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-notices')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'admin-notices' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <FileText className="w-5 h-5" />
              <span>Notices</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-create')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'admin-create' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Sparkles className="w-5 h-5" />
              <span>Publish</span>
            </button>
            <button
              onClick={() => setActiveTab('admin-analytics')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'admin-analytics' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>Gaps</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('student-dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'student-dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'notices' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <FileText className="w-5 h-5" />
              <span>Notices</span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'assistant' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Sparkles className="w-5 h-5" />
              <span>AI Bot</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'events' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'bookmarks' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Bookmark className="w-5 h-5" />
              <span>Saved</span>
            </button>
          </>
        )}
      </nav>

      {/* Global Modals */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => {
          setSelectedNotice(null);
          setHighlightPassage(undefined);
        }}
        highlightPassage={highlightPassage}
        onOpenEventRegister={(n) => {
          setSelectedNotice(null);
          setRegisteringEvent(n);
        }}
      />

      <EventRegistrationModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
      />

      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onSelectNotice={handleOpenNotice}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        initialRole={authRole}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <MainAppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
