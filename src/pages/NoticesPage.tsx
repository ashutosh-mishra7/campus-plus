import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Grid,
  List as ListIcon,
  Tag,
  Flame,
  History,
  FileText,
  X,
} from 'lucide-react';
import { Notice, NoticeCategory } from '../types';
import { useApp } from '../context/AppContext';
import { NoticeCard } from '../components/NoticeCard';
import { searchNotices } from '../services/aiSearchService';

interface NoticesPageProps {
  onOpenNotice: (notice: Notice, passage?: string) => void;
}

export const NoticesPage: React.FC<NoticesPageProps> = ({ onOpenNotice }) => {
  const { publishedNotices, categories, logSearchQuery } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [filterImportantOnly, setFilterImportantOnly] = useState(false);
  const [filterRevisedOnly, setFilterRevisedOnly] = useState(false);
  const [filterHasEventsOnly, setFilterHasEventsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views'>('newest');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Perform search or category filtering
  let displayNotices = publishedNotices;

  if (query.trim()) {
    const searchRes = searchNotices(query, publishedNotices);
    displayNotices = searchRes.map((r) => r.notice);
  }

  if (selectedCategory !== 'All') {
    displayNotices = displayNotices.filter((n) => n.category === selectedCategory);
  }

  if (filterImportantOnly) {
    displayNotices = displayNotices.filter((n) => n.isImportant);
  }

  if (filterRevisedOnly) {
    displayNotices = displayNotices.filter((n) => n.isRevised);
  }

  if (filterHasEventsOnly) {
    displayNotices = displayNotices.filter((n) => n.hasEvent);
  }

  // Sort
  displayNotices = [...displayNotices].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (sortBy === 'oldest') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    if (sortBy === 'views') return b.viewCount - a.viewCount;
    return 0;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const res = searchNotices(query, publishedNotices);
      logSearchQuery(query, res.length, res.length > 0 ? res[0].notice.category : 'None', res.map((r) => r.notice.id), res.length > 0);
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setFilterImportantOnly(false);
    setFilterRevisedOnly(false);
    setFilterHasEventsOnly(false);
  };

  const hasActiveFilters = query || selectedCategory !== 'All' || filterImportantOnly || filterRevisedOnly || filterHasEventsOnly;

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Page Title Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">Official Repository</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Campus Notice Board
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Search, filter, and review verified notices, circulars, exam rosters, and event bulletins.
          </p>
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
          {/* Search Input Row */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
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
                placeholder="Search notices by keyword, passage or question..."
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
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          {/* Categories Horizontal Scroll */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <button
              className={`cat-badge ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              All Categories ({publishedNotices.length})
            </button>
            {categories
              .filter((c) => c.isActive)
              .map((cat) => {
                const count = publishedNotices.filter((n) => n.category === cat.name).length;
                return (
                  <button
                    key={cat.name}
                    className={`cat-badge ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
          </div>

          {/* Quick Filter Toggles & Sort Options */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${filterImportantOnly ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterImportantOnly(!filterImportantOnly)}
              >
                <Flame className="w-3.5 h-3.5" />
                Important Only
              </button>

              <button
                type="button"
                className={`btn btn-sm ${filterRevisedOnly ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterRevisedOnly(!filterRevisedOnly)}
              >
                <History className="w-3.5 h-3.5" />
                Revised Only
              </button>

              <button
                type="button"
                className={`btn btn-sm ${filterHasEventsOnly ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterHasEventsOnly(!filterHasEventsOnly)}
              >
                <Calendar className="w-3.5 h-3.5" />
                Has Events
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={clearAllFilters}
                  style={{ color: 'var(--danger)', fontSize: '0.8125rem' }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
              <select
                className="form-select"
                style={{ padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notices Output Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing {displayNotices.length} notice{displayNotices.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Notices Cards Grid */}
        {displayNotices.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {displayNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onOpen={onOpenNotice} />
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
            <FileText className="w-12 h-12 text-slate-400" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              No Matching Notices Found
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '400px', margin: '4px auto 16px' }}>
              No campus circulars match your current search filters.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={clearAllFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
