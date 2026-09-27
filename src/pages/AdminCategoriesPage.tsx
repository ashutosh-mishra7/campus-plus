import React, { useState } from 'react';
import { FolderKanban, PlusCircle, CheckCircle2, AlertTriangle, Edit, Power } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoticeCategory } from '../types';
import { useToast } from '../components/Toast';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, toggleCategoryStatus, addCategory, notices } = useApp();
  const { showToast } = useToast();

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggle = (name: NoticeCategory) => {
    // Check if category has active notices
    const activeCount = notices.filter((n) => n.category === name && n.status === 'published').length;
    const cat = categories.find((c) => c.name === name);

    if (cat?.isActive && activeCount > 0) {
      if (
        !window.confirm(
          `Category "${name}" currently has ${activeCount} active published notice(s). Disabling it will prevent new notices from being filed under this category. Proceed?`
        )
      ) {
        return;
      }
    }

    toggleCategoryStatus(name);
    showToast(`Category "${name}" status toggled`, 'info');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    if (categories.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      showToast('A category with this name already exists', 'warning');
      return;
    }

    addCategory(newCatName.trim(), newCatDesc.trim() || 'Custom academic category');
    showToast(`Category "${newCatName}" created successfully!`, 'success');
    setNewCatName('');
    setNewCatDesc('');
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-important">Taxonomy & Organization</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Category & Classification System
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Manage notice categories, enable/disable classifications, and view active notice allocations.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ gap: '6px' }}>
            <PlusCircle className="w-4 h-4" />
            Add Custom Category
          </button>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {categories.map((cat) => {
            const count = notices.filter((n) => n.category === cat.name).length;
            const publishedCount = notices.filter((n) => n.category === cat.name && n.status === 'published').length;

            return (
              <div
                key={cat.name}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: cat.isActive ? 1 : 0.65,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-primary">{cat.name}</span>
                  <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-draft'}`}>
                    {cat.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {cat.description}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong>{count}</strong> Total ({publishedCount} Live)
                  </span>

                  <button
                    className={`btn btn-sm ${cat.isActive ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleToggle(cat.name as any)}
                    style={{ fontSize: '0.75rem', gap: '4px' }}
                  >
                    <Power className="w-3 h-3" />
                    {cat.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Custom Category</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Campus Housing & Mess"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description / Scope</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe what notices belong in this classification..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
