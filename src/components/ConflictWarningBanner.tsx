import React from 'react';
import { AlertTriangle, Clock, ArrowRight, FileText, CheckCircle2, History } from 'lucide-react';
import { Notice } from '../types';

interface ConflictWarningBannerProps {
  notice: Notice;
  onOpenRevisionModal: () => void;
  onOpenNotice?: (id: string) => void;
}

export const ConflictWarningBanner: React.FC<ConflictWarningBannerProps> = ({
  notice,
  onOpenRevisionModal,
}) => {
  if (!notice.isRevised || !notice.revisions || notice.revisions.length === 0) {
    return null;
  }

  const latestRevision = notice.revisions[0];

  return (
    <div
      style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '16px 18px',
        margin: '16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            backgroundColor: '#fef3c7',
            padding: '8px',
            borderRadius: '8px',
            color: '#d97706',
            display: 'flex',
          }}
        >
          <AlertTriangle style={{ width: '20px', height: '20px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#92400e' }}>
              Notice Revision Notice — Discrepancies Resolved
            </div>
            <button
              onClick={onOpenRevisionModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#b45309',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <History style={{ width: '14px', height: '14px' }} />
              Compare Version Diff
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#78350f', marginTop: '4px', lineHeight: 1.5 }}>
            This notice was officially revised from <strong>{latestRevision.version}</strong> to{' '}
            <strong>{notice.currentVersion}</strong> on{' '}
            {new Date(notice.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
          </p>

          <div
            style={{
              marginTop: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#92400e', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Chronological Revision Timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8125rem' }}>
                <span
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  Original ({latestRevision.version})
                </span>
                <span style={{ color: '#475569', textDecoration: 'line-through' }}>
                  {latestRevision.previousSnapshot.venue ? `Venue: ${latestRevision.previousSnapshot.venue}` : latestRevision.previousSnapshot.summary}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8125rem' }}>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  Latest Active ({notice.currentVersion})
                </span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                  {notice.eventData?.venue ? `Venue: ${notice.eventData.venue}` : latestRevision.changeSummary}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
