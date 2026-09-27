import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  Calendar,
  FileText,
  Bookmark,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickSearch: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup', role?: 'student' | 'admin') => void;
  onOpenNoticeDetail?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickSearch,
  onOpenAuthModal,
  onOpenNoticeDetail,
}) => {
  const {
    currentUser,
    role,
    logout,
    loginAs,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    bookmarks,
  } = useApp();
  const { showToast } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchRole = (targetRole: 'student' | 'admin') => {
    loginAs(targetRole);
    setShowProfileMenu(false);
    showToast(
      `Switched context to ${targetRole === 'admin' ? 'Campus Administrator' : 'Student (Aarav Sharma)'}`,
      'success'
    );
    if (targetRole === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('student-dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    showToast('Logged out successfully', 'info');
    setActiveTab('landing');
  };

  const handleNotificationClick = (notifId: string, targetNoticeId?: string) => {
    markNotificationRead(notifId);
    setShowNotifications(false);
    if (targetNoticeId && onOpenNoticeDetail) {
      onOpenNoticeDetail(targetNoticeId);
    }
  };

  return (
    <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab(role === 'admin' ? 'admin-dashboard' : role === 'student' ? 'student-dashboard' : 'landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Campus<span style={{ color: 'var(--primary)' }}>Pulse</span>
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Verified Notice Platform
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {role === 'admin' ? (
            <>
              <button
                className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('admin-dashboard')}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'admin-notices' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('admin-notices')}
              >
                <FileText className="w-4 h-4" />
                Notices
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'admin-create' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('admin-create')}
              >
                <PlusCircle className="w-4 h-4" />
                Create Notice
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'admin-events' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('admin-events')}
              >
                <Calendar className="w-4 h-4" />
                Events
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'admin-categories' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('admin-categories')}
              >
                <FolderKanban className="w-4 h-4" />
                Categories
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'admin-analytics' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('admin-analytics')}
              >
                <Search className="w-4 h-4" />
                Search Analytics
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn btn-sm ${activeTab === 'student-dashboard' || activeTab === 'landing' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab(role === 'student' ? 'student-dashboard' : 'landing')}
              >
                Home
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'notices' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('notices')}
              >
                <FileText className="w-4 h-4" />
                Notices
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'events' ? 'btn-subtle' : 'btn-ghost'}`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar className="w-4 h-4" />
                Events
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'assistant' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('assistant')}
                style={activeTab !== 'assistant' ? { color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </button>
              {role === 'student' && (
                <button
                  className={`btn btn-sm ${activeTab === 'bookmarks' ? 'btn-subtle' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('bookmarks')}
                >
                  <Bookmark className="w-4 h-4" />
                  Bookmarks ({bookmarks.length})
                </button>
              )}
            </>
          )}
        </nav>

        {/* Right Actions: Quick Search, Notifications, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Search Button */}
          <button
            onClick={onOpenQuickSearch}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              gap: '8px',
            }}
          >
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hide-on-mobile" style={{ fontSize: '0.8125rem' }}>Ask / Search...</span>
            <kbd
              className="hide-on-mobile"
              style={{
                fontSize: '0.7rem',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-strong)',
                borderRadius: '4px',
                padding: '1px 5px',
                color: 'var(--text-muted)',
              }}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ position: 'relative', padding: '8px' }}
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 0 2px #ffffff',
                  }}
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '360px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 200,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Notifications ({notifications.length})
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id, n.targetNoticeId)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: n.isRead ? '#ffffff' : 'var(--primary-50)',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: n.isRead ? 'transparent' : 'var(--primary)',
                              marginTop: '6px',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div
                  style={{
                    padding: '8px 16px',
                    borderTop: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-subtle)',
                  }}
                >
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('notifications');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Role Switcher Menu */}
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 10px', gap: '8px', borderRadius: '8px' }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: role === 'admin' ? '#fef3c7' : 'var(--primary-50)',
                    color: role === 'admin' ? '#d97706' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left' }} className="hide-on-mobile">
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.1 }}>
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '240px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 200,
                    padding: '8px',
                    animation: 'fadeIn 0.15s ease-out',
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <span className={`badge ${role === 'admin' ? 'badge-important' : 'badge-primary'}`}>
                        {role === 'admin' ? 'Admin Access' : 'Verified Student'}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Role Switcher */}
                  <div style={{ padding: '4px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 10px' }}>
                      Switch User Role
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8125rem' }}
                      onClick={() => handleSwitchRole('student')}
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                      Student Profile
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8125rem' }}
                      onClick={() => handleSwitchRole('admin')}
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      Admin Studio
                    </button>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)', fontSize: '0.8125rem' }}
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenAuthModal('login', 'student')}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onOpenAuthModal('signup', 'student')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
