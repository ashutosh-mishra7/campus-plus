import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Flame,
  Clock,
  Calendar,
  Bookmark,
  ArrowRight,
  History,
  AlertCircle,
  Tag,
  CheckCircle2,
  FileText,
  HelpCircle,
  Eye,
  Bell,
} from 'lucide-react';
import { Notice, CampusEvent, NoticeCategory } from '../types';
import { useApp } from '../context/AppContext';
import { NoticeCard } from '../components/NoticeCard';
import { EventCard } from '../components/EventCard';
import { searchNotices } from '../services/aiSearchService';

interface StudentDashboardProps {
  onOpenNotice: (notice: Notice) => void;
  onNavigate: (tab: string) => void;
  onOpenRegisterEvent: (event: CampusEvent) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenNotice,
  onNavigate,
  onOpenRegisterEvent,
}) => {
  const {
    currentUser,
    publishedNotices,
    events,
    bookmarks,
    recentlyViewedIds,
    categories,
    logSearchQuery,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');

  // Search or Filter
  const filteredNotices = publishedNotices.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const importantNotices = publishedNotices.filter((n) => n.isImportant);
  const revisedNotices = publishedNotices.filter((n) => n.isRevised);
  const bookmarkedNotices = publishedNotices.filter((n) => bookmarks.includes(n.id));
  const recentlyViewedNotices = recentlyViewedIds
    .map((id) => publishedNotices.find((n) => n.id === id))
    .filter(Boolean) as Notice[];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const res = searchNotices(searchQuery, publishedNotices);
      logSearchQuery(searchQuery, res.length, res.length > 0 ? res[0].notice.category : 'None', res.map((r) => r.notice.id), res.length > 0);
    }
  };

  return (
    <div style={{ padding: '1.75rem 0 3.5rem' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '280px',
              height: '100%',
              background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-primary">
                  {currentUser?.department || 'Computer Science & Engineering'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ID: {currentUser?.studentId || '2023CS0142'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Here is your live campus directive feed. All notices are verified and synchronized in real time.
              </p>
            </div>

            {/* Quick Stats Pill Counters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                  {bookmarkedNotices.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED NOTICES</div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#b45309' }}>
                  {revisedNotices.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>REVISED NOTICES</div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--success-text)' }}>
                  {events.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE EVENTS</div>
              </div>
            </div>
          </div>

          {/* Global Notice Search & AI Entry Box */}
          <form onSubmit={handleSearchSubmit} style={{ marginTop: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-strong)',
                borderRadius: '12px',
                padding: '4px 8px',
                gap: '8px',
              }}
            >
              <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" style={{ marginLeft: '6px' }} />
              <input
                type="text"
                placeholder="Search notices, exams, deadlines, venue changes..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '8px 0',
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('assistant')}
                style={{ gap: '6px' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Assistant
              </button>
            </div>
          </form>

          {/* Direct AI Assistant Prompt Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '12px', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <Sparkles className="w-3 h-3 text-indigo-600" /> AI Suggestions:
            </span>
            {[
              'Where is HackNova 2026 being held?',
              'What is the cutoff CGPA for Google placement?',
              'Are mid-semester exams rescheduled?',
              'Last date for fee payment without penalty?',
            ].map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSearchQuery(promptText)}
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Two Columns Grid Layout: Main Feed & Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.3fr) minmax(0, 1fr)', gap: '2rem' }}>
          {/* Main Feed Column */}
          <div>
            {/* Important Notices Banner / Carousel */}
            {importantNotices.length > 0 && !searchQuery && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--danger-bg)', padding: '6px', borderRadius: '6px', color: 'var(--danger)' }}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    High Priority Notices
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {importantNotices.slice(0, 2).map((n) => (
                    <NoticeCard key={n.id} notice={n} onOpen={onOpenNotice} />
                  ))}
                </div>
              </div>
            )}

            {/* Recently Updated & Revised Notices Section */}
            {revisedNotices.length > 0 && !searchQuery && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ backgroundColor: 'var(--purple-bg)', padding: '6px', borderRadius: '6px', color: 'var(--purple-text)' }}>
                      <History className="w-4 h-4" />
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Recently Revised Notices (Conflict Discrepancies)
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {revisedNotices.slice(0, 2).map((n) => (
                    <NoticeCard key={n.id} notice={n} onOpen={onOpenNotice} />
                  ))}
                </div>
              </div>
            )}

            {/* Category Quick Navigation Chips */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  All Campus Notices
                </h2>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate('notices')}
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  View Full Directory <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
                <button
                  className={`cat-badge ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('All')}
                >
                  All Categories ({publishedNotices.length})
                </button>
                {categories
                  .filter((c) => c.isActive)
                  .map((cat) => {
                    const count = publishedNotices.filter((n) => n.category === cat.name).length;
                    return (
                      <button
                        key={cat.name}
                        className={`cat-badge ${selectedCategory === cat.name ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.name)}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Filtered Notices Grid */}
            {filteredNotices.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {filteredNotices.map((n) => (
                  <NoticeCard key={n.id} notice={n} onOpen={onOpenNotice} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <FileText className="w-10 h-10 text-slate-400" style={{ margin: '0 auto 8px' }} />
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  No Notices Found Under This Filter
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Try selecting "All Categories" or clearing the search query.
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Upcoming Events & Deadlines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Upcoming Events Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Upcoming Events ({events.length})
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate('events')}
                  style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                >
                  See All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onNavigate('events')}
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="badge badge-primary">{evt.category}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {evt.eventDate}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '6px' }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      📍 {evt.venue}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines Timeline */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
                <Clock className="w-4 h-4 text-amber-600" />
                Critical Deadlines
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.825rem' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>
                    Sep 30
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Google & Microsoft Registration</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Superset placement portal closing</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.825rem' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>
                    Oct 06
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Exam Medical Document Submission</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dean of Student Affairs Office</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.825rem' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>
                    Oct 10
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Semester Fee Payment Deadline</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero late fine extension</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.825rem' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>
                    Oct 12
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>HackNova 2026 Team Registrations</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>APJ Kalam Auditorium</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Viewed Notices */}
            {recentlyViewedNotices.length > 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  <Eye className="w-4 h-4 text-slate-500" />
                  Recently Viewed
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {recentlyViewedNotices.slice(0, 3).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => onOpenNotice(n)}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {n.category} • {n.noticeNumber}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
