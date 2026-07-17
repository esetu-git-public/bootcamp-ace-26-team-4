import React, { useEffect, useState } from 'react';
import { MessageSquareWarning, ThumbsUp, ThumbsDown, Trash2, RefreshCw } from 'lucide-react';
import { api, type FeedbackPayload } from '../api';

const LOCAL_KEY = 'mrp_feedback_log';

const loadLocalFeedback = (): FeedbackPayload[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const mergeFeedback = (local: FeedbackPayload[], remote: FeedbackPayload[]): FeedbackPayload[] => {
  const byId = new Map<string, FeedbackPayload>();
  // Remote entries first, then local overwrite duplicates with the same
  // messageId — either source is fine since payloads are identical.
  [...remote, ...local].forEach((item) => {
    byId.set(`${item.messageId}-${item.timestamp}`, item);
  });
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const FeedbackAdmin: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackPayload[]>([]);
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const local = loadLocalFeedback();
    const remote = await api.getFeedback(); // resolves to [] if the backend route doesn't exist yet
    setFeedback(mergeFeedback(local, remote));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleClearLocal = () => {
    if (!confirm('Clear all locally stored feedback from this browser? This cannot be undone.')) return;
    localStorage.removeItem(LOCAL_KEY);
    load();
  };

  const filtered = feedback.filter((f) => filter === 'all' || f.rating === filter);
  const upCount = feedback.filter((f) => f.rating === 'up').length;
  const downCount = feedback.filter((f) => f.rating === 'down').length;

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div>
          <h1 className="page-title">
            <MessageSquareWarning color="var(--color-primary)" />
            User Feedback
          </h1>
          <p className="page-description">
            Feedback submitted on chat answers across the app.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="template-btn" onClick={load} title="Refresh">
            <RefreshCw size={14} style={{ marginRight: '6px' }} />
            Refresh
          </button>
          <button
            className="template-btn"
            onClick={handleClearLocal}
            style={{ color: 'var(--color-danger)' }}
            title="Clear locally stored feedback"
          >
            <Trash2 size={14} style={{ marginRight: '6px' }} />
            Clear Local
          </button>
        </div>
      </div>

      <div className="feedback-note">
        Feedback is currently stored in each user's browser (localStorage) and merged here with
        anything the backend returns from <code>GET /api/feedback</code>, if that route exists.
        For a complete cross-device picture, the backend should persist feedback centrally.
      </div>

      <div className="eval-grid" style={{ marginBottom: '24px' }}>
        <div className="eval-metric-card glass-card">
          <span className="metric-label">Total Feedback</span>
          <div className="metric-value">{feedback.length}</div>
        </div>
        <div className="eval-metric-card glass-card">
          <span className="metric-label">Positive</span>
          <div className="metric-value">{upCount}</div>
        </div>
        <div className="eval-metric-card glass-card">
          <span className="metric-label">Negative</span>
          <div className="metric-value" style={{ color: 'var(--color-danger)', textShadow: 'none' }}>{downCount}</div>
        </div>
      </div>

      <div className="template-selector" style={{ marginBottom: '20px' }}>
        <button
          className={`template-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`template-btn ${filter === 'up' ? 'active' : ''}`}
          onClick={() => setFilter('up')}
        >
          <ThumbsUp size={14} style={{ marginRight: '4px' }} />
          Positive
        </button>
        <button
          className={`template-btn ${filter === 'down' ? 'active' : ''}`}
          onClick={() => setFilter('down')}
        >
          <ThumbsDown size={14} style={{ marginRight: '4px' }} />
          Negative
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading feedback...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No feedback to show yet.
        </div>
      ) : (
        <div className="feedback-admin-list">
          {filtered.map((item, idx) => (
            <div key={`${item.messageId}-${idx}`} className="glass-card feedback-admin-item">
              <div className="feedback-admin-header">
                <span className={`feedback-admin-badge ${item.rating}`}>
                  {item.rating === 'up' ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
                  {item.rating === 'up' ? 'Helpful' : 'Not Helpful'}
                </span>
                <span className="feedback-admin-time">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>

              {item.question && (
                <div className="feedback-admin-field">
                  <span className="feedback-admin-field-label">Question</span>
                  <p>{item.question}</p>
                </div>
              )}

              <div className="feedback-admin-field">
                <span className="feedback-admin-field-label">Answer</span>
                <p>{item.answer.length > 300 ? item.answer.slice(0, 300) + '...' : item.answer}</p>
              </div>

              {item.comment && (
                <div className="feedback-admin-field">
                  <span className="feedback-admin-field-label">User Comment</span>
                  <p style={{ color: 'var(--color-danger)' }}>{item.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};