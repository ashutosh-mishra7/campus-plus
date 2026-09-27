import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  Copy,
  Archive,
  Eye,
  CheckCircle,
  History,
  MoreVertical,
  Flame,
  ArrowUpDown,
} from 'lucide-react';
import { Notice, NoticeCategory, NoticeStatus } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

interface AdminNoticesPageProps {
  onOpenNotice: (notice: Notice) => void;
  onEditNotice: (notice: Notice) => void;
  onCreateNotice: () => void;
}

export const AdminNoticesPage: React.FC<AdminNoticesPageProps> = ({
  onOpenNotice,
  onEditNotice,
  onCreateNotice,
}) => {
  const {
    notices,
    deleteNotice,
    archiveNotice,
    publishDraftNotice,
    duplicateNotice,
    categories,
  } = useApp();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<NoticeStatus | 'All'>('All');
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Filter
  const filteredNotices = notices.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && n.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.noticeNumber.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete notice "${title}"? This cannot be undone.`)) {
      deleteNotice(id);
      showToast('Notice permanently deleted', 'info');
      setActiveActionMenuId(null);
    }
  };

  const handleArchive = (id: string) => {
    archiveNotice(id);
    showToast('Notice moved to archive', 'info');
    setActiveActionMenuId(null);
  };

  const handlePublish = (id: string) => {
    publishDraftNotice(id);
    showToast('Draft notice published successfully and is now visible to students!', 'success');
    setActiveActionMenuId(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateNotice(id);
    showToast('Notice duplicated into drafts', 'success');
    setActiveActionMenuId(null);
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-important">Administrative Studio</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Campus Notices Directory
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Create, edit, revise, archive, and audit all official circulars with full revision versioning.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onCreateNotice} style={{ gap: '6px' }}>
            <PlusCircle className="w-4 h-4" />
            Create Notice
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div
              style={{
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
                placeholder="Search by title, ID or tags..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '6px 8px',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
            >
              <option value="All">All Categories ({notices.length})</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
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
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>ID / Notice</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Version</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Published</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Views</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice) => (
                    <tr
                      key={notice.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Notice Title & Number */}
                      <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {notice.noticeNumber}
                          </span>
                          {notice.isImportant && (
                            <span className="badge badge-important" style={{ padding: '1px 5px', fontSize: '0.68rem' }}>
                              Important
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginTop: '2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => onOpenNotice(notice)}
                        >
                          {notice.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge badge-primary">{notice.category}</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          className={`badge ${
                            notice.status === 'published'
                              ? 'badge-success'
                              : notice.status === 'draft'
                              ? 'badge-draft'
                              : 'badge-important'
                          }`}
                        >
                          {notice.status}
                        </span>
                      </td>

                      {/* Version & Revision */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          className={`badge ${notice.isRevised ? 'badge-revised' : 'badge-draft'}`}
                        >
                          {notice.currentVersion}
                        </span>
                        {notice.revisions.length > 0 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                            ({notice.revisions.length} rev)
                          </span>
                        )}
                      </td>

                      {/* Published Date */}
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {new Date(notice.publishedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Views */}
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {notice.viewCount}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenNotice(notice)}
                            title="View Notice Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onEditNotice(notice)}
                            title="Edit & Create Revision"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDuplicate(notice.id)}
                            title="Duplicate Notice"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          </button>

                          {notice.status === 'draft' ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handlePublish(notice.id)}
                              title="Publish Draft"
                              style={{ color: 'var(--success)' }}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleArchive(notice.id)}
                              title="Archive Notice"
                            >
                              <Archive className="w-3.5 h-3.5 text-amber-600" />
                            </button>
                          )}

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDelete(notice.id, notice.title)}
                            title="Delete Notice"
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No notices match the selected filters.
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
