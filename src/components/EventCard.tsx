import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { CampusEvent } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';

interface EventCardProps {
  event: CampusEvent;
  onOpenNotice: (noticeId: string) => void;
  onRegister: (event: CampusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onOpenNotice, onRegister }) => {
  const { isBookmarked, toggleBookmark } = useApp();
  const { showToast } = useToast();

  const bookmarked = isBookmarked(event.noticeId);

  const eventDateObj = new Date(event.eventDate);
  const monthName = isNaN(eventDateObj.getTime())
    ? 'OCT'
    : eventDateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNumber = isNaN(eventDateObj.getTime()) ? '18' : eventDateObj.getDate();

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(event.noticeId);
    showToast(
      bookmarked ? 'Removed from saved bookmarks' : 'Event bookmarked successfully!',
      bookmarked ? 'info' : 'success'
    );
  };

  const getStatusBadge = () => {
    switch (event.status) {
      case 'registration_open':
        return <span className="badge badge-success">Registration Open</span>;
      case 'registration_closing_soon':
        return <span className="badge badge-important">Closing Soon</span>;
      case 'today':
        return <span className="badge badge-primary">Happening Today</span>;
      case 'completed':
        return <span className="badge badge-draft">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-important">Cancelled</span>;
      default:
        return <span className="badge badge-primary">Upcoming</span>;
    }
  };

  return (
    <div
      className="card card-interactive"
      onClick={() => onOpenNotice(event.noticeId)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Top Date Badge & Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Calendar Day Box */}
          <div
            style={{
              backgroundColor: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              borderRadius: '10px',
              padding: '6px 12px',
              textAlign: 'center',
              minWidth: '54px',
            }}
          >
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--primary)',
                letterSpacing: '0.05em',
              }}
            >
              {monthName}
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {dayNumber}
            </div>
          </div>

          <div>
            <span className="badge badge-primary">{event.category}</span>
            <div style={{ marginTop: '4px' }}>{getStatusBadge()}</div>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: bookmarked ? 'var(--primary)' : 'var(--text-light)',
          }}
          title="Bookmark Event"
        >
          <Bookmark
            className="w-4 h-4"
            style={{
              fill: bookmarked ? 'var(--primary)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Event Title */}
      <h3
        style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.35,
          marginBottom: '0.5rem',
        }}
      >
        {event.title}
      </h3>

      {/* Short Description */}
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {event.shortDescription}
      </p>

      {/* Details Box */}
      <div
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span>{event.eventTime}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.venue}
          </span>
        </div>
        {event.organizer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.organizer}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <button
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenNotice(event.noticeId);
          }}
          style={{ fontSize: '0.78rem' }}
        >
          <FileText className="w-3 h-3" />
          Source Notice
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRegister(event);
          }}
          style={{ fontSize: '0.78rem' }}
        >
          Register <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
