import React, { useState } from 'react';
import { X, History, ArrowRight, UserCheck, Calendar, CheckCircle, SplitSquareVertical } from 'lucide-react';
import { Notice, NoticeRevision } from '../types';
import { computeWordDiff, computeLineDiff } from '../services/diffService';

interface RevisionHistoryModalProps {
  notice: Notice;
  onClose: () => void;
}

export const RevisionHistoryModal: React.FC<RevisionHistoryModalProps> = ({ notice, onClose }) => {
  const [selectedRevisionIndex, setSelectedRevisionIndex] = useState<number>(0);
  const [diffMode, setDiffMode] = useState<'inline' | 'split'>('inline');

  const revisions = notice.revisions || [];
  const currentRev: NoticeRevision | undefined = revisions[selectedRevisionIndex];

  if (!currentRev) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Revision History</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="modal-body">
            <p style={{ color: 'var(--text-secondary)' }}>This notice is at its initial published version ({notice.currentVersion}). No prior revisions exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const oldText = currentRev.previousSnapshot.content || currentRev.previousSnapshot.summary || '';
  const newText = currentRev.currentSnapshot.content || currentRev.currentSnapshot.summary || '';

  const wordDiffs = computeWordDiff(oldText, newText);
  const lineDiffs = computeLineDiff(oldText, newText);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                padding: '8px',
                borderRadius: '8px',
              }}
            >
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Notice Revision Timeline & Visual Diff
              </h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {notice.noticeNumber} — {notice.title}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '72vh' }}>
          {/* Revisions Navigation Selector */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            {revisions.map((rev, idx) => (
              <button
                key={rev.id}
                onClick={() => setSelectedRevisionIndex(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: idx === selectedRevisionIndex ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: idx === selectedRevisionIndex ? 'var(--primary-50)' : '#ffffff',
                  color: idx === selectedRevisionIndex ? 'var(--primary-700)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minWidth: '180px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {rev.version} → {idx === 0 ? notice.currentVersion : revisions[idx - 1]?.version}
                  </span>
                  {idx === 0 && <span className="badge badge-primary">Latest</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(rev.editedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </button>
            ))}
          </div>

          {/* Revision Metadata Card */}
          <div
            style={{
              marginTop: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '10px',
              padding: '14px 16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <strong>Edited By:</strong> {currentRev.editedBy} ({currentRev.editorRole})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  {new Date(currentRev.editedAt).toLocaleDateString()} at {new Date(currentRev.editedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* View Diff Mode Switcher */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className={`btn btn-sm ${diffMode === 'inline' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDiffMode('inline')}
                >
                  Inline Word Diff
                </button>
                <button
                  className={`btn btn-sm ${diffMode === 'split' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDiffMode('split')}
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  Side-by-Side
                </button>
              </div>
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              <strong>Summary of Changes:</strong> {currentRev.changeSummary}
            </div>

            {currentRev.changedFields && currentRev.changedFields.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Changed Fields:</span>
                {currentRev.changedFields.map((f) => (
                  <span key={f} className="badge badge-updated" style={{ textTransform: 'capitalize' }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Visual Diff View */}
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Visual Content Difference (Green: Added, Red Strikethrough: Removed)
              </div>
            </div>

            {diffMode === 'inline' ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  lineHeight: 1.8,
                  maxHeight: '360px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {wordDiffs.map((seg, i) => {
                  if (seg.added) {
                    return (
                      <span key={i} className="diff-added">
                        {seg.value}
                      </span>
                    );
                  }
                  if (seg.removed) {
                    return (
                      <span key={i} className="diff-removed">
                        {seg.value}
                      </span>
                    );
                  }
                  return <span key={i}>{seg.value}</span>;
                })}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  style={{
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fed7d7',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    maxHeight: '360px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#9b2c2c', marginBottom: '8px', borderBottom: '1px solid #feb2b2', paddingBottom: '4px' }}>
                    Previous Version ({currentRev.version})
                  </div>
                  {oldText}
                </div>

                <div
                  style={{
                    backgroundColor: '#f0fff4',
                    border: '1px solid #c6f6d5',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    maxHeight: '360px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#22543d', marginBottom: '8px', borderBottom: '1px solid #9ae6b4', paddingBottom: '4px' }}>
                    Updated Version ({notice.currentVersion})
                  </div>
                  {newText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
