import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle, Sparkles, User, Mail, Hash, Users, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusEvent, Notice } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';

interface EventRegistrationModalProps {
  event: CampusEvent | Notice | null;
  onClose: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, onClose }) => {
  const { currentUser } = useApp();
  const { showToast } = useToast();

  const [name, setName] = useState(currentUser?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'student@campus.edu');
  const [studentId, setStudentId] = useState(currentUser?.studentId || '2023CS0142');
  const [teamName, setTeamName] = useState('');
  const [dietary, setDietary] = useState('Standard (Vegetarian)');
  const [submitted, setSubmitted] = useState(false);

  if (!event) return null;

  const eventTitle = event.title;
  const eventVenue = 'eventData' in event && event.eventData ? event.eventData.venue : (event as CampusEvent).venue;
  const eventDate = 'eventData' in event && event.eventData ? event.eventData.eventDate : (event as CampusEvent).eventDate;
  const eventTime = 'eventData' in event && event.eventData ? event.eventData.eventTime : (event as CampusEvent).eventTime;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.log('Confetti error', err);
    }

    showToast('Registration Confirmed! E-Pass sent to your email.', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {submitted ? 'Registration Confirmed!' : 'Event Registration'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Official Campus Admission Desk
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <CheckCircle className="w-14 h-14 text-emerald-600" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              You're Registered!
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              Your seat for <strong>{eventTitle}</strong> has been officially reserved. An electronic pass with admission QR code has been emailed to <strong>{email}</strong>.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '14px',
                margin: '18px 0',
                textAlign: 'left',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Event Pass Details:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                📍 <strong>Venue:</strong> {eventVenue}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                🗓️ <strong>Date:</strong> {eventDate} ({eventTime})
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                🆔 <strong>Registration ID:</strong> REG-{Math.floor(100000 + Math.random() * 900000)}
              </div>
            </div>

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                {eventTitle}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                📍 {eventVenue} • 🗓️ {eventDate}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Campus Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Team / Project Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ByteBusters (Leave blank if individual)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Refreshment / Dietary Preference</label>
              <select className="form-select" value={dietary} onChange={(e) => setDietary(e.target.value)}>
                <option value="Standard (Vegetarian)">Standard (Vegetarian)</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Confirm & Reserve Seat
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
