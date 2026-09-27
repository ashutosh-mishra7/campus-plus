import React, { useState } from 'react';
import {
  Calendar,
  Search,
  PlusCircle,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { CampusEvent, EventStatus } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

interface AdminEventsPageProps {
  onNavigate: (tab: string) => void;
  onOpenNotice: (noticeId: string) => void;
}

export const AdminEventsPage: React.FC<AdminEventsPageProps> = ({
  onNavigate,
  onOpenNotice,
}) => {
  const { events, updateNotice, notices } = useApp();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'All'>('All');

  const filteredEvents = events.filter((evt) => {
    if (selectedStatus !== 'All' && evt.status !== selectedStatus) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (event: CampusEvent, newStatus: EventStatus) => {
    const notice = notices.find((n) => n.id === event.noticeId);
    if (!notice || !notice.eventData) return;

    updateNotice(
      notice.id,
      {
        eventData: {
          ...notice.eventData,
          status: newStatus,
        },
      },
      `Event status updated to ${newStatus.replace(/_/g, ' ')}.`
    );

    showToast(`Event marked as ${newStatus.replace(/_/g, ' ')}`, 'success');
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-important">Administrative Console</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Campus Event Operations
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Monitor and synchronize event schedules, update registration deadlines, and manage event statuses.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => onNavigate('admin-create')} style={{ gap: '6px' }}>
            <PlusCircle className="w-4 h-4" />
            Publish Event Notice
          </button>
        </div>

        {/* Filter Controls */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '8px',
              padding: '4px 10px',
              border: '1px solid var(--border-subtle)',
              minWidth: '280px',
            }}
          >
            <Search className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search active events..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '6px 8px',
                fontSize: '0.875rem',
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['All', 'registration_open', 'registration_closing_soon', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                className={`btn btn-sm ${selectedStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}
                onClick={() => setSelectedStatus(st as any)}
              >
                {st === 'All' ? 'All' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Events Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Event & Title</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Date & Time</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Venue</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Registrations</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => (
                    <tr
                      key={evt.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="badge badge-primary">{evt.category}</span>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {evt.noticeNumber}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                          {evt.title}
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{evt.eventDate}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.eventTime}</div>
                      </td>

                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {evt.venue}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          className={`badge ${
                            evt.status === 'registration_open'
                              ? 'badge-success'
                              : evt.status === 'registration_closing_soon'
                              ? 'badge-important'
                              : 'badge-draft'
                          }`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {evt.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>
                          {evt.currentRegistrations || 0} / {evt.maxParticipants || 100}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {evt.bookmarkCount} Bookmarks
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenNotice(evt.noticeId)}
                            title="View Source Notice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {evt.status !== 'completed' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateStatus(evt, 'completed')}
                              title="Mark Event Completed"
                              style={{ color: 'var(--success)' }}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {evt.status !== 'cancelled' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateStatus(evt, 'cancelled')}
                              title="Cancel Event"
                              style={{ color: 'var(--danger)' }}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No events match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
