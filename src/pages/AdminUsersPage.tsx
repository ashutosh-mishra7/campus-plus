import React, { useState } from 'react';
import { Users, Search, UserCheck, UserX, Shield, Mail, Calendar, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

export const AdminUsersPage: React.FC = () => {
  const { users, toggleUserStatus } = useApp();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.studentId?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleStatus = (userId: string, currentStatus: string, name: string) => {
    toggleUserStatus(userId);
    showToast(
      `User account "${name}" is now ${currentStatus === 'active' ? 'suspended' : 'active'}`,
      'info'
    );
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-important">Account Access Governance</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Student & User Management
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Audit registered student profiles, verify department enrollments, and manage platform permissions.
          </p>
        </div>

        {/* Search Bar */}
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
              placeholder="Search users by name, email, roll no, or department..."
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
        </div>

        {/* Users Table */}
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
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Student / User</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Department</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Role</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Joined</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: user.role === 'admin' ? '#fef3c7' : 'var(--primary-50)',
                            color: user.role === 'admin' ? '#d97706' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                          }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {user.email} {user.studentId ? `• ${user.studentId}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {user.department || 'Campus Administration'}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${user.role === 'admin' ? 'badge-important' : 'badge-primary'}`}>
                        {user.role}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-draft'}`}>
                        {user.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(user.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {user.role !== 'admin' && (
                        <button
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleToggleStatus(user.id, user.status, user.name)}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
