import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  History,
  AlertTriangle,
  Flame,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';

interface NotificationsPageProps {
  onOpenNotice: (notice: Notice) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onOpenNotice }) => {
  const {
    notifications,
    publishedNotices,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType === 'revisions') return n.type === 'revision';
    if (filterType === 'important') return n.type === 'important';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'revision':
        return <History className="w-5 h-5 text-purple-600" />;
      case 'important':
        return <Flame className="w-5 h-5 text-red-600" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleItemClick = (notifId: string, targetNoticeId?: string) => {
    markNotificationRead(notifId);
    if (targetNoticeId) {
      const notice = publishedNotices.find((n) => n.id === targetNoticeId);
      if (notice) onOpenNotice(notice);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">In-App Notification Center</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Notifications & Alerts
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Stay informed about notice revisions, upcoming deadlines, and critical circulars.
            </p>
          </div>

          {unreadNotificationCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllNotificationsRead}>
              <CheckCheck className="w-4 h-4 text-indigo-600" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('all')}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            className={`btn btn-sm ${filterType === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('unread')}
          >
            Unread ({unreadNotificationCount})
          </button>
          <button
            className={`btn btn-sm ${filterType === 'revisions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('revisions')}
          >
            Notice Revisions
          </button>
          <button
            className={`btn btn-sm ${filterType === 'important' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('important')}
          >
            High Priority
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif.id, notif.targetNoticeId)}
                style={{
                  backgroundColor: notif.isRead ? '#ffffff' : 'var(--primary-50)',
                  border: '1px solid',
                  borderColor: notif.isRead ? 'var(--border-subtle)' : 'var(--primary-200)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--shadow-xs)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = notif.isRead ? 'var(--border-subtle)' : 'var(--primary-200)';
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getIcon(notif.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {notif.title}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>

                  {notif.targetNoticeId && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                      View Target Notice <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {!notif.isRead && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      flexShrink: 0,
                      marginTop: '6px',
                    }}
                    title="Unread notification"
                  />
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <Bell className="w-12 h-12 text-slate-400" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                No Notifications Found
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                You're all caught up! No alerts match your current filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
