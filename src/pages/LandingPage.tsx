import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  History,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Zap,
  Bookmark,
  Users,
  Compass,
  Lock,
} from 'lucide-react';
import { Notice } from '../types';
import { searchNotices } from '../services/aiSearchService';
import { useApp } from '../context/AppContext';
import { NoticeCard } from '../components/NoticeCard';

interface LandingPageProps {
  onOpenNotice: (notice: Notice) => void;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup', role?: 'student' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenNotice,
  onNavigate,
  onOpenAuth,
}) => {
  const { publishedNotices, logSearchQuery } = useApp();
  const [query, setQuery] = useState('');
  const [liveResults, setLiveResults] = useState<ReturnType<typeof searchNotices>>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = searchNotices(query, publishedNotices);
    setLiveResults(res);
    setHasSearched(true);
    logSearchQuery(query, res.length, res.length > 0 ? res[0].notice.category : 'None', res.map((r) => r.notice.id), res.length > 0);
  };

  const handlePromptClick = (text: string) => {
    setQuery(text);
    const res = searchNotices(text, publishedNotices);
    setLiveResults(res);
    setHasSearched(true);
    logSearchQuery(text, res.length, res.length > 0 ? res[0].notice.category : 'None', res.map((r) => r.notice.id), res.length > 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '4.5rem 1rem 3.5rem',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '860px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              border: '1px solid var(--primary-200)',
            }}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI-Powered Official Notice Retrieval Platform
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Instant, Evidence-Backed Answers From{' '}
            <span style={{ color: 'var(--primary)' }}>Official Campus Notices</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '700px',
              margin: '0 auto 2.25rem',
            }}
          >
            Never dig through endless PDFs or miss crucial schedule revisions. Ask natural language questions, discover upcoming hackathons, and verify official directives in seconds.
          </p>

          {/* Natural Language Hero Search Box */}
          <form onSubmit={handleSearch} style={{ maxWidth: '720px', margin: '0 auto 1.5rem' }}>
            <div className="search-box-hero">
              <Search className="w-6 h-6 text-indigo-600 flex-shrink-0" style={{ marginLeft: '6px' }} />
              <input
                type="text"
                placeholder="Ask e.g. 'What is the revised venue for HackNova 2026?'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-md">
                Search Notices
              </button>
            </div>
          </form>

          {/* Suggested Natural Language Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Popular Queries:</span>
            {[
              'HackNova venue change',
              'Mid semester exam dates',
              'Semester fee payment deadline',
              'Google placement CGPA criteria',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(p)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-200)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Interactive Search Results Stream (if user searched on landing) */}
      {hasSearched && (
        <section style={{ padding: '2.5rem 1rem', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Search Results for "{query}"
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Found {liveResults.length} verified notice{liveResults.length !== 1 ? 's' : ''} with extracted evidence
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setHasSearched(false);
                  setQuery('');
                }}
              >
                Clear Results
              </button>
            </div>

            {liveResults.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {liveResults.map((res) => (
                  <NoticeCard
                    key={res.notice.id}
                    notice={res.notice}
                    matchedPassage={res.matchedPassage}
                    matchReason={res.matchReason}
                    onOpen={onOpenNotice}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px' }}>
                <AlertTriangle className="w-10 h-10 text-amber-500" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  No Matching Verified Notice Found
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '6px auto 16px' }}>
                  CampusPulse strictly refuses to hallucinate or fabricate information. Only officially published university notices are indexed.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('notices')}>
                  Browse All Notices
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust & Guarantee Banner */}
      <section style={{ padding: '2rem 1rem', backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>100% Evidence-Backed</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Every answer cites official published circulars</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <History className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>Revision & Conflict Tracking</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Side-by-side diffs when venues or dates change</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <Zap className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>Zero Hallucination Guarantee</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Refuses queries lacking documented ground-truth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section style={{ padding: '4.5rem 1rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Pillars of CampusPulse</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Designed For High-Stakes Campus Communication
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Built specifically to eliminate confusion from outdated circulars, lost emails, and conflicting notice boards.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Feature 1 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Search className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Natural Language Semantic Search
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Search using conversational questions like "What is the fee payment deadline?" instead of hunting for specific file names. Exact passages are retrieved and highlighted.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--purple-bg)',
                  color: 'var(--purple-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                AI Campus Assistant
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                An intelligent campus bot that answers student inquiries with verifiable citations. Each response includes clickable badge links directly to the original notice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--warning-bg)',
                  color: 'var(--warning-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <History className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Revision & Conflict Engine
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                When notices are updated, prior versions are permanently archived. Visual side-by-side diffs highlight exactly what changed in dates, venues, and criteria.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Calendar className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Automated Event Aggregation
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Any notice mentioning an event, date, or venue automatically syncs into the live Event Calendar with registration links and countdown clocks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Layers className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Auto Category Classification
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Smart algorithms scan notice drafts and automatically suggest the most relevant classification among 12 university categories with high accuracy.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Bookmark & Revision Alerts
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Bookmark important notices and receive instant in-app alerts whenever an administrator modifies deadlines or instructions on your saved items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive "How It Works" Section */}
      <section style={{ padding: '4.5rem 1rem', backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Seamless Workflow</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              How CampusPulse Powers Academic Clarity
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', position: 'relative' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)',
                  marginBottom: '1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Admin Publishes Notice
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Administrative staff creates a notice or uploads a PDF. AI automatically tags categories, extracts text, and surfaces event parameters.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)',
                  marginBottom: '1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Instant Indexing & Revision Sync
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Content passages are immediately indexed. If modified later, previous versions are preserved with change summaries and diff tracking.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)',
                  marginBottom: '1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Students Query with Confidence
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Students search in plain English and receive answers backed by official citations, highlighted evidence passages, and conflict notices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Notices Preview */}
      <section style={{ padding: '4.5rem 1rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Official Feed</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Latest Verified Campus Notices
              </h2>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('notices')}>
              Explore All Notices ({publishedNotices.length}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {publishedNotices.slice(0, 3).map((n) => (
              <NoticeCard key={n.id} notice={n} onOpen={onOpenNotice} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'var(--primary-50)', borderTop: '1px solid var(--primary-100)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-700)', marginBottom: '0.75rem' }}>
            Ready to Experience Clean Campus Intelligence?
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Join thousands of university students and faculty using CampusPulse for unambiguous, verified academic directives.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => onOpenAuth('signup', 'student')}>
              Sign Up as Student
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onOpenAuth('login', 'admin')}>
              <Lock className="w-4 h-4" /> Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', padding: '3rem 1rem 2rem', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Campus<span style={{ color: 'var(--primary)' }}>Pulse</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The evidence-backed campus notice and academic event retrieval platform for forward-thinking universities.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Student Services
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onNavigate('notices')}>Notice Board</button></li>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onNavigate('events')}>Event Hub</button></li>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onNavigate('assistant')}>Campus Assistant</button></li>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onNavigate('bookmarks')}>Saved Bookmarks</button></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Administration
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onOpenAuth('login', 'admin')}>Admin Console</button></li>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onNavigate('admin-create')}>Publish Notice</button></li>
              <li><button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => onNavigate('admin-analytics')}>Search Gaps</button></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Academic Integrity
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              CampusPulse employs strict retrieval-augmented generation (RAG) constraints. All outputs are bound to verified digital signatures of university circulars.
            </p>
          </div>
        </div>

        <div className="container" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>© 2026 CampusPulse University Systems. All rights reserved.</div>
          <div>Verified Academic Information Management Infrastructure</div>
        </div>
      </footer>
    </div>
  );
};
