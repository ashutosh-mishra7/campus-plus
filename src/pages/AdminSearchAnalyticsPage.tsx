import React from 'react';
import {
  Search,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminSearchAnalyticsPageProps {
  onNavigate: (tab: string) => void;
}

export const AdminSearchAnalyticsPage: React.FC<AdminSearchAnalyticsPageProps> = ({
  onNavigate,
}) => {
  const { searchLogs } = useApp();

  const answeredLogs = searchLogs.filter((l) => l.wasAnswered);
  const unansweredLogs = searchLogs.filter((l) => !l.wasAnswered);

  // Group queries to compute frequency
  const queryCounts: Record<string, number> = {};
  searchLogs.forEach((l) => {
    const q = l.query.trim();
    queryCounts[q] = (queryCounts[q] || 0) + 1;
  });

  const topQueries = Object.entries(queryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-important">Intelligence & Discovery</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Search Analytics & Content Gaps
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Audit student search queries, discover missing information, and resolve content gaps with targeted notice publications.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => onNavigate('admin-create')} style={{ gap: '6px' }}>
            <PlusCircle className="w-4 h-4" />
            Publish Notice
          </button>
        </div>

        {/* Top Summary Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL SEARCH QUERIES</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {searchLogs.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-text)' }}>
              {answeredLogs.length} Successfully Resolved ({Math.round((answeredLogs.length / Math.max(searchLogs.length, 1)) * 100)}%)
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700 }}>UNANSWERED CONTENT GAPS</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626', margin: '6px 0 2px' }}>
              {unansweredLogs.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>
              Action recommended to publish circulars
            </div>
          </div>
        </div>

        {/* Content Gaps Spotlight (Missing Notices) */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Content Gaps: What Students Are Looking For
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            These natural-language questions yielded 0 matching official notices. Use the <strong>"Publish Notice"</strong> shortcut to file an official announcement addressing these gaps.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {unansweredLogs.length > 0 ? (
              unansweredLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      "{log.query}"
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Logged {new Date(log.timestamp).toLocaleDateString()} • User Role: {log.userRole}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigate('admin-create')}
                    style={{ fontSize: '0.78rem', gap: '4px' }}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Publish Notice for this Gap
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active content gaps. Notice repository coverage is 100%!
              </div>
            )}
          </div>
        </div>

        {/* Top Search Queries Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Top Searched Topics & Query Logs
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topQueries.map(([queryText, count], idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '20px' }}>#{idx + 1}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{queryText}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {count} search{count > 1 ? 'es' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
