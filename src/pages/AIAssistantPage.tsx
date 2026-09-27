import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  FileText,
  AlertTriangle,
  History,
  CornerDownRight,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage, Notice } from '../types';
import { generateAIAnswer } from '../services/aiSearchService';
import { useApp } from '../context/AppContext';

interface AIAssistantPageProps {
  onOpenNotice: (notice: Notice, passage?: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onOpenNotice }) => {
  const { publishedNotices, logSearchQuery } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Hello! I am your **Campus Assistant**, an AI retrieval system strictly grounded in official university notices.\n\nI answer questions regarding exam timetables, hackathons, scholarships, fee deadlines, and schedule revisions. Every response cites verified source notices with exact passages.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'What is the revised venue for HackNova 2026?',
        'When do Autumn 2026 mid-sem exams commence?',
        'What is the last date to pay tuition fee without fine?',
        'What is the CGPA eligibility for Google placement?',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate realistic RAG passage retrieval latency
    setTimeout(() => {
      const response = generateAIAnswer(query, publishedNotices);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        conflictAlert: response.conflictAlert,
        suggestedFollowUps: response.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      logSearchQuery(
        query,
        response.citations.length,
        response.citations.length > 0 ? response.citations[0].category : 'None',
        response.citations.map((c) => c.noticeId),
        response.citations.length > 0
      );
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-reset',
        sender: 'assistant',
        content: `Conversation refreshed. How can I help you query verified campus circulars today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'What is the revised venue for HackNova 2026?',
          'When do Autumn 2026 mid-sem exams commence?',
          'Are there any scholarships for female students in STEM?',
        ],
      },
    ]);
  };

  const handleCitationClick = (citationNoticeId: string, passage: string) => {
    const target = publishedNotices.find((n) => n.id === citationNoticeId);
    if (target) {
      onOpenNotice(target, passage);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
        {/* Assistant Header Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Campus Assistant
                </h1>
                <span className="badge badge-success">
                  <ShieldCheck className="w-3 h-3" /> Grounded RAG
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Evidence-First Retrieval System • Strict Zero Hallucination
              </div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleResetChat} title="Reset Chat History">
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Chat
          </button>
        </div>

        {/* Chat Thread Container */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            height: '68vh',
            minHeight: '520px',
            overflow: 'hidden',
          }}
        >
          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.sender === 'assistant' && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div style={{ maxWidth: '82%' }}>
                  {/* Message Bubble */}
                  <div
                    style={{
                      backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.925rem',
                      lineHeight: 1.65,
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>

                  {/* Conflict Notice Warning if Discrepancy Found */}
                  {msg.conflictAlert && (
                    <div
                      style={{
                        marginTop: '10px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '10px',
                        padding: '12px 14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#92400e' }}>
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        {msg.conflictAlert.title}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '4px' }}>
                        {msg.conflictAlert.details}
                      </p>

                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {msg.conflictAlert.chronology.map((c, i) => (
                          <div key={i} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`badge ${c.isLatest ? 'badge-success' : 'badge-draft'}`}>
                              {c.isLatest ? 'Latest' : 'Prior'}
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>{c.date}:</span>
                            <strong style={{ color: 'var(--text-primary)' }}>{c.info}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence Citations Cards */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Verified Sources & Supporting Citations:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {msg.citations.map((cite, i) => (
                          <div
                            key={i}
                            onClick={() => handleCitationClick(cite.noticeId, cite.passage)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-200)';
                              e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                              e.currentTarget.style.backgroundColor = '#ffffff';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                              <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  [{cite.noticeNumber}] {cite.title}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {cite.category} • Updated {new Date(cite.publishedDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                              Open <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {msg.suggestedFollowUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(fu)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '9999px',
                            padding: '4px 10px',
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
                          <CornerDownRight className="w-3 h-3 text-indigo-600" />
                          <span>{fu}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                  Searching verified campus notices & synthesizing passage evidence...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Ask about exam schedules, fees, venues, hackathons..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                style={{ backgroundColor: '#ffffff' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!inputText.trim() || isTyping}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Send className="w-4 h-4" />
                Ask
              </button>
            </form>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
              CampusPulse Assistant strictly queries published notices. It never accesses external web resources or creates unverified assertions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
