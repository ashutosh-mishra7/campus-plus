import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CampusEvent, EventStatus, NoticeCategory } from '../types';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';

interface EventsPageProps {
  onOpenNotice: (noticeId: string) => void;
  onRegisterEvent: (event: CampusEvent) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onOpenNotice,
  onRegisterEvent,
}) => {
  const { events, categories } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Filter events
  const todayStr = '2026-09-27';

  const filteredEvents = events.filter((evt) => {
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && evt.status !== selectedStatus) return false;

    // Past events filter
    const isPast = new Date(evt.eventDate).getTime() < new Date(todayStr).getTime();
    if (!showPastEvents && isPast) return false;
    if (showPastEvents && !isPast) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q) ||
        evt.shortDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">Auto-Synchronized</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Campus Events & Hackathons
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Events automatically extracted from published notices. Register directly and track schedules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${!showPastEvents ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowPastEvents(false)}
            >
              Upcoming ({events.filter((e) => new Date(e.eventDate).getTime() >= new Date(todayStr).getTime()).length})
            </button>
            <button
              className={`btn btn-sm ${showPastEvents ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowPastEvents(true)}
            >
              <Archive className="w-3.5 h-3.5" />
              Past Archive
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.75rem',
          }}
        >
          {/* Search Row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '8px',
                padding: '4px 10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Search className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search events by name, organizer, or venue..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '6px 8px',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('cards')}
                title="Card Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('calendar')}
                title="Calendar Timeline View"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Calendar
              </button>
            </div>
          </div>

          {/* Filter Statuses & Categories */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {(['All', 'registration_open', 'registration_closing_soon', 'upcoming'] as const).map((st) => (
                <button
                  key={st}
                  className={`btn btn-sm ${selectedStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}
                  onClick={() => setSelectedStatus(st as any)}
                >
                  {st === 'All' ? 'All Statuses' : st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
              <select
                className="form-select"
                style={{ padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === 'cards' ? (
          filteredEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onOpenNotice={onOpenNotice}
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
                padding: '3rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <CalendarIcon className="w-12 h-12 text-slate-400" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                No Events Found
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                No campus events match your selected filters or search terms.
              </p>
            </div>
          )
        ) : (
          /* Calendar Timeline View */
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Academic Event Timeline (October - November 2026)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredEvents.map((evt) => {
                const dt = new Date(evt.eventDate);
                return (
                  <div
                    key={evt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'var(--primary-50)',
                        border: '1px solid var(--primary-200)',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        textAlign: 'center',
                        minWidth: '70px',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {isNaN(dt.getTime()) ? 'OCT' : dt.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {isNaN(dt.getTime()) ? '18' : dt.getDate()}
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge-primary">{evt.category}</span>
                        <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                          {evt.status.replace(/_/g, ' ')}
                        </span>
                        {evt.registrationDeadline && (
                          <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
                            Deadline: {evt.registrationDeadline}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          margin: '6px 0 4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => onOpenNotice(evt.noticeId)}
                      >
                        {evt.title}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                        {evt.shortDescription}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock className="w-3.5 h-3.5 text-indigo-600" /> {evt.eventTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {evt.venue}
                        </span>
                        {evt.organizer && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users className="w-3.5 h-3.5 text-indigo-600" /> {evt.organizer}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => onRegisterEvent(evt)}>
                        Register
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onOpenNotice(evt.noticeId)}>
                        View Notice
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
