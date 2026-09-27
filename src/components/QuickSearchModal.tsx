import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  FileText,
  Calendar,
  AlertTriangle,
  History,
  CornerDownLeft,
} from 'lucide-react';
import { Notice, SearchResult } from '../types';
import { searchNotices } from '../services/aiSearchService';
import { useApp } from '../context/AppContext';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotice: (notice: Notice, matchedPassage?: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNotice,
}) => {
  const { publishedNotices, logSearchQuery } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const searchRes = searchNotices(val, publishedNotices);
    setResults(searchRes);

    if (val.trim().length > 3) {
      const topCat = searchRes.length > 0 ? searchRes[0].notice.category : 'None';
      const matchedIds = searchRes.map((r) => r.notice.id);
      logSearchQuery(val, searchRes.length, topCat, matchedIds, searchRes.length > 0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div
        className="modal-dialog modal-dialog-large"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '12px',
          }}
        >
          <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              background: 'transparent',
            }}
            placeholder="Ask a question or search notices in natural language..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px 20px' }}>
          {query.trim() === '' ? (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Try Asking in Natural Language:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'What is the revised venue for HackNova 2026?',
                  'When do the Autumn 2026 mid semester exams start?',
                  'What is the last date to pay tuition fees without fine?',
                  'What is the eligibility CGPA for Google and Microsoft placement?',
                  'How to apply for Merit-cum-Means scholarship?',
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(sample)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{sample}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Found {results.length} evidence-backed notice result{results.length > 1 ? 's' : ''}
              </div>

              {results.map((res) => (
                <div
                  key={res.notice.id}
                  onClick={() => {
                    onSelectNotice(res.notice, res.matchedPassage);
                    onClose();
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-200)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{res.notice.category}</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {res.notice.noticeNumber}
                    </span>
                    {res.notice.isImportant && <span className="badge badge-important">Important</span>}
                    {res.notice.isRevised && (
                      <span className="badge badge-revised">
                        Revised ({res.notice.currentVersion})
                      </span>
                    )}
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {res.notice.title}
                  </div>

                  {/* Matched Passage Highlight */}
                  <div
                    style={{
                      backgroundColor: '#fefce8',
                      borderLeft: '3px solid #eab308',
                      padding: '8px 10px',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.825rem',
                      color: '#854d0e',
                      lineHeight: 1.5,
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                      Evidence:
                    </span>
                    "{res.matchedPassage}"
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>{res.matchReason}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Notice <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'var(--text-muted)',
                }}
              >
                <Search className="w-6 h-6" />
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                No matching information found
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
                CampusPulse operates on verified published notices only. We do not generate unsupported information.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--bg-subtle)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Evidence-backed Retrieval System</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Press <kbd style={{ padding: '1px 5px', border: '1px solid #cbd5e1', borderRadius: '3px', background: '#fff' }}>Enter</kbd> to view
          </span>
        </div>
      </div>
    </div>
  );
};
