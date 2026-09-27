import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight, CheckCircle2, Building, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
  initialRole?: 'student' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'student',
}) => {
  const { loginWithCredentials, signupStudent, loginAs } = useApp();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [role, setRole] = useState<'student' | 'admin'>(initialRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      if (!email) {
        showToast('Please enter your email address', 'warning');
        return;
      }
      loginWithCredentials(email, role);
      showToast(`Welcome back! Logged in as ${role === 'admin' ? 'Administrator' : 'Student'}`, 'success');
      onClose();
    } else if (mode === 'signup') {
      if (!name || !email || !studentId) {
        showToast('Please fill in all required fields', 'warning');
        return;
      }
      signupStudent({ name, email, studentId, department });
      showToast(`Account created successfully! Welcome to CampusPulse, ${name}`, 'success');
      onClose();
    } else if (mode === 'forgot') {
      if (!email) {
        showToast('Please enter your email address', 'warning');
        return;
      }
      setResetSent(true);
      showToast('Password reset link sent to your email!', 'info');
    }
  };

  const handleQuickDemoLogin = (targetRole: 'student' | 'admin') => {
    loginAs(targetRole);
    showToast(
      `Instant Demo Access: Logged in as ${targetRole === 'admin' ? 'Dr. Sarah Jenkins (Admin)' : 'Aarav Sharma (Student)'}`,
      'success'
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary)',
                padding: '8px',
                borderRadius: '8px',
              }}
            >
              {role === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {mode === 'login' && (role === 'admin' ? 'Admin Portal Login' : 'Student Login')}
                {mode === 'signup' && 'Create Student Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                CampusPulse Academic Platform
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Role Switcher for Login */}
        {mode === 'login' && (
          <div style={{ display: 'flex', padding: '12px 1.5rem 0', gap: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setRole('student')}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Student
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setRole('admin')}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {mode === 'forgot' && resetSent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle2 className="w-12 h-12 text-emerald-600" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Check Your Campus Inbox
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                We have dispatched password recovery instructions to <strong>{email}</strong>.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setResetSent(false);
                  setMode('login');
                }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {mode === 'signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Student ID / Roll No.</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2023CS0142"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Branch</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="School of Management">School of Management</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">University Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="form-group">
                  <div className="form-label">
                    <span>Password</span>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {mode === 'login' && 'Sign In to CampusPulse'}
                {mode === 'signup' && 'Create Free Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </button>

              {/* Quick 1-Click Demo Login Bar */}
              {mode === 'login' && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    border: '1px dashed var(--border-strong)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    🚀 Quick 1-Click Demo Sign In
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                      onClick={() => handleQuickDemoLogin('student')}
                    >
                      Login as Student
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                      onClick={() => handleQuickDemoLogin('admin')}
                    >
                      Login as Admin
                    </button>
                  </div>
                </div>
              )}

              {/* Mode Switchers */}
              <div
                style={{
                  marginTop: '1.25rem',
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
