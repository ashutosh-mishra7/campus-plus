import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Flame,
  Save,
  CheckCircle2,
  ArrowLeft,
  X,
  History,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Notice, NoticeCategory, NoticeAttachment } from '../types';
import { useApp } from '../context/AppContext';
import { classifyNoticeContent } from '../services/categoryClassifier';
import { extractTextFromFile } from '../services/documentExtractor';
import { useToast } from '../components/Toast';

interface AdminCreateEditNoticePageProps {
  editingNotice?: Notice | null;
  onNavigate: (tab: string) => void;
  onSuccess: (notice: Notice) => void;
}

export const AdminCreateEditNoticePage: React.FC<AdminCreateEditNoticePageProps> = ({
  editingNotice,
  onNavigate,
  onSuccess,
}) => {
  const { createNotice, updateNotice, categories, currentUser } = useApp();
  const { showToast } = useToast();

  const isEditing = Boolean(editingNotice);

  // Form State
  const [title, setTitle] = useState(editingNotice?.title || '');
  const [summary, setSummary] = useState(editingNotice?.summary || '');
  const [content, setContent] = useState(editingNotice?.content || '');
  const [category, setCategory] = useState<NoticeCategory>(editingNotice?.category || 'Announcements');
  const [tags, setTags] = useState<string>(editingNotice?.tags?.join(', ') || '');
  const [isImportant, setIsImportant] = useState(editingNotice?.isImportant || false);
  const [isDraft, setIsDraft] = useState(editingNotice?.status === 'draft');

  // Event State
  const [hasEvent, setHasEvent] = useState(editingNotice?.hasEvent || false);
  const [eventDate, setEventDate] = useState(editingNotice?.eventData?.eventDate || '2026-10-20');
  const [eventTime, setEventTime] = useState(editingNotice?.eventData?.eventTime || '10:00 AM - 04:00 PM');
  const [venue, setVenue] = useState(editingNotice?.eventData?.venue || 'Main Campus Auditorium');
  const [organizer, setOrganizer] = useState(editingNotice?.eventData?.organizer || 'University Events Committee');
  const [registrationDeadline, setRegistrationDeadline] = useState(editingNotice?.eventData?.registrationDeadline || '2026-10-15');
  const [registrationUrl, setRegistrationUrl] = useState(editingNotice?.eventData?.registrationUrl || '');

  // Attachments State
  const [attachments, setAttachments] = useState<NoticeAttachment[]>(editingNotice?.attachments || []);
  const [isUploading, setIsUploading] = useState(false);

  // Revision Summary for Edit Mode
  const [changeSummary, setChangeSummary] = useState('');

  // Live Auto Category Suggestion State
  const [suggestedCategory, setSuggestedCategory] = useState<NoticeCategory | null>(null);
  const [categoryConfidence, setCategoryConfidence] = useState<number>(0);
  const [categoryReasons, setCategoryReasons] = useState<string[]>([]);

  // Analyze content in real-time as admin types
  useEffect(() => {
    if (title.length > 5 || content.length > 10) {
      const match = classifyNoticeContent(title, content);
      setSuggestedCategory(match.suggestedCategory);
      setCategoryConfidence(match.confidence);
      setCategoryReasons(match.reasons);
    }
  }, [title, content]);

  // Handle File Upload & Simulated OCR
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    showToast(`Scanning and extracting text from "${file.name}"...`, 'info');

    try {
      const result = await extractTextFromFile(file);
      setAttachments((prev) => [...prev, result.attachment]);

      // If content is empty, auto-populate with extracted OCR text!
      if (!content.trim()) {
        setContent(result.extractedContent);
      }
      if (!title.trim() && result.extractedTitle) {
        setTitle(result.extractedTitle);
      }

      showToast(`Document text indexed and attached successfully!`, 'success');
    } catch (err) {
      showToast(`Failed to parse document: ${err}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyCategory = (cat: NoticeCategory) => {
    setCategory(cat);
    showToast(`Category updated to "${cat}"`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      showToast('Please provide both notice title and content body', 'warning');
      return;
    }

    if (isEditing && !changeSummary.trim()) {
      showToast('Please provide a brief summary of what was revised', 'warning');
      return;
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const eventData = hasEvent
      ? {
          eventDate,
          eventTime,
          venue,
          organizer,
          registrationDeadline,
          registrationUrl: registrationUrl || `https://events.campus.edu/reg/${Date.now()}`,
          status: 'registration_open' as const,
        }
      : undefined;

    if (isEditing && editingNotice) {
      const updated = updateNotice(
        editingNotice.id,
        {
          title,
          summary: summary || content.slice(0, 160) + '...',
          content,
          category,
          tags: tagList,
          isImportant,
          hasEvent,
          eventData,
          attachments,
          status: isDraft ? 'draft' : 'published',
        },
        changeSummary
      );

      if (updated) {
        showToast(
          `Notice updated! Version ${updated.currentVersion} created with diff snapshot`,
          'success'
        );
        onSuccess(updated);
      }
    } else {
      const created = createNotice({
        title,
        summary: summary || content.slice(0, 160) + '...',
        content,
        category,
        tags: tagList,
        isImportant,
        hasEvent,
        eventData,
        attachments,
        status: isDraft ? 'draft' : 'published',
      });

      showToast(
        isDraft
          ? 'Draft notice saved successfully'
          : 'Notice published live to all students and search indices!',
        'success'
      );
      onSuccess(created);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Navigation Breadcrumb */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onNavigate('admin-notices')}
          style={{ marginBottom: '1rem', gap: '6px' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Notice Directory
        </button>

        {/* Page Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-important">
              {isEditing ? `Revising Version ${editingNotice?.currentVersion}` : 'New Publication Studio'}
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {isEditing ? `Edit & Revise Notice: ${editingNotice?.noticeNumber}` : 'Create Campus Notice'}
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            {isEditing
              ? 'Edits create a permanent revision record with diff tracking. Students will be alerted of modifications.'
              : 'Publish circulars, upload official PDFs for automatic text extraction, and sync campus event schedules.'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* If Editing: Mandatory Summary of Changes Callout */}
            {isEditing && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#92400e', marginBottom: '4px' }}>
                  <History className="w-4 h-4 text-amber-600" />
                  Describe Your Revisions (Required for Audit & Diff Logs)
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#78350f', marginBottom: '8px' }}>
                  Explain what has been modified (e.g. "Venue moved to Auditorium", "Registration extended to Oct 15").
                </p>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Updated hackathon venue to APJ Auditorium due to capacity"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Title */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notice Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. HackNova 2026: 36-Hour Annual Campus Hackathon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Document Upload & OCR Extractor */}
            <div
              style={{
                border: '2px dashed var(--border-strong)',
                borderRadius: '12px',
                padding: '1.25rem',
                backgroundColor: 'var(--bg-subtle)',
                textAlign: 'center',
              }}
            >
              <Upload className="w-8 h-8 text-indigo-600" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                Upload Official Circular (PDF, DOCX, or Image)
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px', marginBottom: '12px' }}>
                Readable text will be automatically extracted into the notice body and indexed for search.
              </p>

              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                Browse File
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={isUploading}
                />
              </label>

              {/* Uploaded Attachments Chips */}
              {attachments.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        {att.name} ({att.size})
                      </span>
                      <button
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Automatic Category Suggestion Callout */}
            {suggestedCategory && (
              <div
                style={{
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-700)' }}>
                      AI Suggested Category: <strong>{suggestedCategory}</strong> ({categoryConfidence}% confidence)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {categoryReasons.join(' • ')}
                    </div>
                  </div>
                </div>

                {category !== suggestedCategory && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApplyCategory(suggestedCategory)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    Apply "{suggestedCategory}"
                  </button>
                )}
              </div>
            )}

            {/* Category Select & Important Flag */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Search Keywords / Tags</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. hackathon, coding, ai, prize"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* Executive Summary */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Short Executive Summary</label>
              <input
                type="text"
                className="form-input"
                placeholder="A concise 1-2 sentence overview for notice cards and search previews..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {/* Full Markdown Notice Content */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Notice Content (Markdown Supported)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '200px' }}
                placeholder="Enter complete circular text, instructions, eligibility criteria, guidelines..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Event Toggle & Metadata Sub-form */}
            <div
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem',
                backgroundColor: hasEvent ? '#ffffff' : 'var(--bg-subtle)',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={hasEvent}
                  onChange={(e) => setHasEvent(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Include Event Schedule (Automatically adds to Events Page)</span>
              </label>

              {hasEvent && (
                <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Event Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required={hasEvent}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Event Timing</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 10:00 AM - 04:00 PM"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      required={hasEvent}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Venue / Platform</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. APJ Abdul Kalam Central Auditorium"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      required={hasEvent}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Registration Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={registrationDeadline}
                      onChange={(e) => setRegistrationDeadline(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Organizer Department / Club</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Department of CSE & GDSC Club"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Registration URL (Optional)</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://events.campus.edu/register"
                      value={registrationUrl}
                      onChange={(e) => setRegistrationUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* High Priority & Draft Toggles */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '4px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <Flame className="w-4 h-4 text-red-600" />
                Mark as High Priority / Urgent Notice
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                Save as Draft (Do not publish immediately)
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onNavigate('admin-notices')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.6rem' }}>
                <Save className="w-4 h-4" />
                {isEditing ? 'Publish Revision & Create Diff' : isDraft ? 'Save Draft Notice' : 'Publish Notice Live'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
