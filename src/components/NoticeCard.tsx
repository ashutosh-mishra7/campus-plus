import React from 'react';
import {
  Calendar,
  Bookmark,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  History,
  FileText,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Notice } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';

interface NoticeCardProps {
  notice: Notice;
  onOpen: (notice: Notice) => void;
  matchedPassage?: string;
  matchReason?: string;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  onOpen,
  matchedPassage,
  matchReason,
}) => {
  const { isBookmarked, toggleBookmark, recordNoticeView } = useApp();
  const { showToast } = useToast();

  const bookmarked = isBookmarked(notice.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(notice.id);
    showToast(
      bookmarked ? 'Removed from bookmarks' : 'Added to your bookmarked notices',
      bookmarked ? 'info' : 'success'
    );
  };

  const handleCardClick = () => {
    recordNoticeView(notice.id);
    onOpen(notice);
  };

  return (
    <div
      className="card card-interactive"
      onClick={handleCardClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Top Badges Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{notice.category}</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {notice.noticeNumber}
          </span>
          {notice.isImportant && (
            <span className="badge badge-important">
              <Flame className="w-3 h-3" />
              Important
            </span>
          )}
          {notice.isRevised && (
            <span className="badge badge-revised">
              <History className="w-3 h-3" />
              Revised ({notice.currentVersion})
            </span>
          )}
        </div>

        <button
          onClick={handleBookmark}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: bookmarked ? 'var(--primary)' : 'var(--text-light)',
            display: 'flex',
            transition: 'transform 0.15s ease',
          }}
          title={bookmarked ? 'Remove Bookmark' : 'Bookmark this notice'}
        >
          <Bookmark
            className="w-4 h-4"
            style={{
              fill: bookmarked ? 'var(--primary)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Notice Title */}
      <h3
        style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          marginBottom: '0.5rem',
        }}
      >
        {notice.title}
      </h3>

      {/* Notice Summary or Matched Passage */}
      {matchedPassage ? (
        <div
          style={{
            backgroundColor: '#fefce8',
            borderLeft: '3px solid #eab308',
            padding: '8px 10px',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.825rem',
            color: '#854d0e',
            lineHeight: 1.5,
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
            🎯 Evidence Passage
          </div>
          "{matchedPassage}"
        </div>
      ) : (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {notice.summary || notice.content.slice(0, 140) + '...'}
        </p>
      )}

      {/* Match Reason for Search Results */}
      {matchReason && (
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--primary-700)',
            backgroundColor: 'var(--primary-50)',
            padding: '4px 8px',
            borderRadius: '4px',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{matchReason}</span>
        </div>
      )}

      {/* Event Metadata Highlights if applicable */}
      {notice.hasEvent && notice.eventData && (
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '8px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              <strong>Date:</strong> {notice.eventData.eventDate} ({notice.eventData.eventTime})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong>Venue:</strong> {notice.eventData.venue}
            </span>
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock className="w-3.5 h-3.5" />
          <span>
            {new Date(notice.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          Open Notice <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
