import React from 'react';
import {
  FileText,
  Calendar,
  Layers,
  History,
  Users,
  Search,
  Flame,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenNotice: (notice: Notice) => void;
  onEditNotice: (notice: Notice) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenNotice,
  onEditNotice,
}) => {
  const { notices, publishedNotices, events, users, searchLogs, categories } = useApp();

  const draftNotices = notices.filter((n) => n.status === 'draft');
  const archivedNotices = notices.filter((n) => n.status === 'archived');
  const revisedNotices = notices.filter((n) => n.isRevised);
  const importantNotices = notices.filter((n) => n.isImportant);

  const unansweredQueries = searchLogs.filter((l) => !l.wasAnswered);

  // Category counts
  const categoryCounts = categories.map((cat) => ({
    name: cat.name,
    count: notices.filter((n) => n.category === cat.name).length,
  }));

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-important">Admin Studio Console</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              University Operations Center
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Manage circular publications, verify revision diffs, inspect student search gaps, and track campus event schedules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('admin-create')} style={{ gap: '6px' }}>
              <PlusCircle className="w-4 h-4" />
              Create Notice
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('admin-notices')}>
              Notice Table
            </button>
          </div>
        </div>

        {/* 8 Metric KPI Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {/* Metric 1 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>TOTAL NOTICES</span>
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {notices.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-text)' }}>
              {publishedNotices.length} Active Published
            </div>
          </div>

          {/* Metric 2 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>DRAFT NOTICES</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {draftNotices.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Pending internal review
            </div>
          </div>

          {/* Metric 3 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>REVISED NOTICES</span>
              <History className="w-4 h-4 text-purple-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {revisedNotices.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--purple-text)' }}>
              With diff version history
            </div>
          </div>

          {/* Metric 4 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>CAMPUS EVENTS</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {events.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-text)' }}>
              Auto-synced from notices
            </div>
          </div>

          {/* Metric 5 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>STUDENT USERS</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {users.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Active campus accounts
            </div>
          </div>

          {/* Metric 6 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>SEARCH VOLUME</span>
              <Search className="w-4 h-4 text-indigo-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {searchLogs.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-text)' }}>
              Queries resolved by AI
            </div>
          </div>

          {/* Metric 7 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>CONTENT GAPS</span>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626', margin: '6px 0 2px' }}>
              {unansweredQueries.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>
              Unanswered student queries
            </div>
          </div>

          {/* Metric 8 */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>IMPORTANT NOTICES</span>
              <Flame className="w-4 h-4 text-red-600" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {importantNotices.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>
              High-priority broadcast
            </div>
          </div>
        </div>

        {/* Visual Analytics & Content Gaps Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Category Distribution Bar Chart Visualizer */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Notice Distribution by Category
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin-categories')}>
                Manage Categories <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoryCounts.slice(0, 6).map((cat) => {
                const percentage = Math.round((cat.count / Math.max(notices.length, 1)) * 100);
                return (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{cat.count} notices ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.max(percentage, 4)}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Content Gaps / Missing Notices */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Student Content Gaps
                </h2>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin-analytics')}>
                Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Questions students searched for but our current notice collection could not answer:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {unansweredQueries.length > 0 ? (
                unansweredQueries.slice(0, 3).map((gap) => (
                  <div
                    key={gap.id}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      "{gap.query}"
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>0 results found</span>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                        onClick={() => onNavigate('admin-create')}
                      >
                        Publish Notice
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No content gaps detected. All queries are resolved!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Admin Action Stream & Published Notices */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Notices & Publication Activity
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('admin-notices')}>
              View All in Table
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '240px' }}>
                  <span className="badge badge-primary">{notice.category}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {notice.noticeNumber}
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {notice.title}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${notice.status === 'published' ? 'badge-success' : 'badge-draft'}`}>
                    {notice.status}
                  </span>
                  {notice.isRevised && (
                    <span className="badge badge-revised">{notice.currentVersion}</span>
                  )}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(notice.updatedAt).toLocaleDateString()}
                  </span>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenNotice(notice)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onEditNotice(notice)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Edit & Revise
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
