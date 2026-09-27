import React, { useState } from 'react';
import {
  Bookmark,
  FileText,
  Calendar,
  Trash2,
  ArrowRight,
  History,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Notice, CampusEvent, NoticeCategory } from '../types';
import { useApp } from '../context/AppContext';
import { NoticeCard } from '../components/NoticeCard';
import { EventCard } from '../components/EventCard';
import { useToast } from '../components/Toast';

interface BookmarksPageProps {
  onOpenNotice: (notice: Notice) => void;
  onRegisterEvent: (event: CampusEvent) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  onOpenNotice,
  onRegisterEvent,
}) => {
  const { publishedNotices, events, bookmarks, toggleBookmark } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'notices' | 'events'>('notices');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const savedNotices = publishedNotices.filter((n) => bookmarks.includes(n.id));
  const savedEvents = events.filter((e) => bookmarks.includes(e.noticeId));

  const filteredNotices = savedNotices.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  );

  const revisedSavedNotices = savedNotices.filter((n) => n.isRevised);

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">Personal Collection</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Saved Bookmarks & Watchlist
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Track notices and events you have pinned. You will be automatically notified if an admin revises any of these items.
          </p>
        </div>

        {/* Revised Notice Alert on Bookmarks */}
        {revisedSavedNotices.length > 0 && (
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e' }}>
                  {revisedSavedNotices.length} bookmarked notice{revisedSavedNotices.length > 1 ? 's have' : ' has'} been updated recently
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350f' }}>
                  Administrators have issued revisions on deadlines or venues. Check the version diff.
                </div>
              </div>
            </div>
            <span className="badge badge-updated">Revision Alert Active</span>
          </div>
        )}

        {/* Tab Switcher: Notices vs Events */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'notices' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('notices')}
            >
              <FileText className="w-3.5 h-3.5" />
              Saved Notices ({savedNotices.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar className="w-3.5 h-3.5" />
              Saved Events ({savedEvents.length})
            </button>
          </div>
        </div>

        {/* Content Render */}
        {activeTab === 'notices' ? (
          filteredNotices.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} onOpen={onOpenNotice} />
              ))}
            </div>
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
              <Bookmark className="w-12 h-12 text-slate-400" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                No Bookmarked Notices Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Click the bookmark icon on any notice card to save it here for fast reference.
              </p>
            </div>
          )
        ) : (
          savedEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {savedEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onOpenNotice={(id) => {
                    const n = publishedNotices.find((item) => item.id === id);
                    if (n) onOpenNotice(n);
                  }}
                  onRegister={onRegisterEvent}
                />
              ))}
            </div>
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
              <Calendar className="w-12 h-12 text-slate-400" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                No Bookmarked Events Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Save upcoming hackathons and workshops to track their registration deadlines.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
