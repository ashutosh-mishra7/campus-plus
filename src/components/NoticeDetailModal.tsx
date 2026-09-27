import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  Download,
  FileText,
  History,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Tag,
  Building,
  Eye,
  Layers,
} from 'lucide-react';
import { Notice } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';
import { ConflictWarningBanner } from './ConflictWarningBanner';
import { RevisionHistoryModal } from './RevisionHistoryModal';

interface NoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
  highlightPassage?: string;
  onOpenEventRegister?: (notice: Notice) => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  onClose,
  highlightPassage,
  onOpenEventRegister,
}) => {
  const { isBookmarked, toggleBookmark, recordNoticeView } = useApp();
  const { showToast } = useToast();
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedAttachmentText, setSelectedAttachmentText] = useState<string | null>(null);

  if (!notice) return null;

  const bookmarked = isBookmarked(notice.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Notice link copied to clipboard!', 'success');
  };

  const handleToggleBookmark = () => {
    toggleBookmark(notice.id);
    showToast(
      bookmarked ? 'Notice removed from saved bookmarks' : 'Notice added to your bookmarks!',
      bookmarked ? 'info' : 'success'
    );
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-dialog modal-dialog-large"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '92vh' }}
        >
          {/* Header */}
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{notice.category}</span>
              <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {notice.noticeNumber}
              </span>
              {notice.isImportant && <span className="badge badge-important">Important</span>}
              {notice.isRevised && (
                <span className="badge badge-revised">
                  Revised ({notice.currentVersion})
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleToggleBookmark}
                title={bookmarked ? 'Remove Bookmark' : 'Bookmark Notice'}
              >
                <Bookmark
                  className="w-4 h-4"
                  style={{
                    color: bookmarked ? 'var(--primary)' : 'var(--text-muted)',
                    fill: bookmarked ? 'var(--primary)' : 'none',
                  }}
                />
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleShare} title="Share Notice">
                <Share2 className="w-4 h-4 text-slate-600" />
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onClose}>
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* Title */}
            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                marginBottom: '12px',
              }}
            >
              {notice.title}
            </h1>

            {/* Author & Meta Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building className="w-4 h-4 text-indigo-600" />
                <span>
                  <strong>{notice.author.name}</strong> • {notice.author.department}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>
                  Published:{' '}
                  {new Date(notice.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {notice.isRevised && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--purple-text)' }}>
                  <History className="w-4 h-4" />
                  <span>
                    Updated:{' '}
                    {new Date(notice.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{notice.viewCount} Views</span>
              </div>
            </div>

            {/* Conflict / Revision Alert */}
            {notice.isRevised && (
              <ConflictWarningBanner
                notice={notice}
                onOpenRevisionModal={() => setShowRevisionModal(true)}
              />
            )}

            {/* Event Summary Card if Notice has Event */}
            {notice.hasEvent && notice.eventData && (
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '16px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Event & Schedule Information
                  </div>
                  <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                    {notice.eventData.status.replace('_', ' ')}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>DATE & TIME</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {notice.eventData.eventDate} ({notice.eventData.eventTime})
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>VENUE / PLATFORM</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{notice.eventData.venue}</strong>
                  </div>

                  {notice.eventData.registrationDeadline && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>REGISTRATION DEADLINE</span>
                      <strong style={{ color: '#b45309' }}>{notice.eventData.registrationDeadline}</strong>
                    </div>
                  )}

                  {notice.eventData.organizer && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>ORGANIZER</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{notice.eventData.organizer}</strong>
                    </div>
                  )}
                </div>

                {notice.eventData.registrationUrl && (
                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                    {onOpenEventRegister ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onOpenEventRegister(notice)}
                      >
                        Register for Event
                      </button>
                    ) : (
                      <a
                        href={notice.eventData.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Official Registration Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Matched Passage Callout if Search Target */}
            {highlightPassage && (
              <div
                style={{
                  backgroundColor: '#fefce8',
                  border: '1px solid #fef08a',
                  borderLeft: '4px solid #eab308',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  margin: '14px 0',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#854d0e', marginBottom: '4px' }}>
                  🎯 Search Query Evidence Passage
                </div>
                <div style={{ fontSize: '0.875rem', color: '#713f12', lineHeight: 1.5 }}>
                  "{highlightPassage}"
                </div>
              </div>
            )}

            {/* Main Content */}
            <div
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--text-primary)',
                margin: '18px 0',
                whiteSpace: 'pre-line',
              }}
            >
              {notice.content}
            </div>

            {/* Supporting Documents & Attachments */}
            {notice.attachments && notice.attachments.length > 0 && (
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Official Attachments & Extracted Documents ({notice.attachments.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notice.attachments.map((att) => (
                    <div
                      key={att.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {att.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {att.type.toUpperCase()} • {att.size}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {att.extractedText && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setSelectedAttachmentText(
                                selectedAttachmentText === att.extractedText ? null : att.extractedText!
                              )
                            }
                          >
                            {selectedAttachmentText === att.extractedText ? 'Hide OCR' : 'View Text'}
                          </button>
                        )}
                        <a
                          href={att.url || '#'}
                          download={att.name}
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            if (!att.url || att.url === '#') {
                              e.preventDefault();
                              showToast(`Downloading verified document ${att.name}`, 'info');
                            }
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Extracted Document Text Preview */}
                {selectedAttachmentText && (
                  <div
                    style={{
                      marginTop: '12px',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.6,
                      maxHeight: '220px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <div style={{ color: '#38bdf8', marginBottom: '6px', fontWeight: 600 }}>
                      [Verified OCR Index Output]
                    </div>
                    {selectedAttachmentText}
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {notice.tags && notice.tags.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {notice.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            {notice.isRevised && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowRevisionModal(true)}
                style={{ marginRight: 'auto' }}
              >
                <History className="w-4 h-4 text-purple-600" />
                View Version Diff History
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {showRevisionModal && (
        <RevisionHistoryModal
          notice={notice}
          onClose={() => setShowRevisionModal(false)}
        />
      )}
    </>
  );
};
