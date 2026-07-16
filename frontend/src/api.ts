// API Client for MRP Medical Research RAG Backend

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('mrp_token');
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AskResult {
  question: string;
  answer: string;
  formatted_references: string;
  references: Array<{
    text?: string;
    filename?: string;
    source_file?: string;
    title?: string;
    journal?: string;
    publication_year?: string;
    pmc_id?: string;
  }>;
  claim_mapping?: any;
  metadata: {
    template: string;
    route?: string;
    intent?: string;
    retrieved_chunks: number;
    grouped_papers?: number;
    references: number;
    retrieval_confidence_score: number;
    retrieval_confidence_level: string;
    evidence_semantic_similarity?: number;
    answer_score?: number;
    final_score?: number;
    retrieval_score_normalized?: number;
  };
}

export interface UploadedFile {
  filename: string;
  size: number;
  last_modified: number;
}

export interface EvaluationResult {
  id?: string;
  question: string;
  reference_answer: string;
  generated_answer: string;
  keyword_recall: number | null;
  precision: number | null;
  recall: number | null;
  retrieved_chunks?: any[];
}

export interface EvaluationReport {
  status: 'completed' | 'in_progress' | 'paused';
  message?: string;
  completed_questions: number;
  total_questions: number;
  pending_questions: number;
  summary: {
    average_keyword_recall: number | null;
    average_precision_at_k: number | null;
    average_recall_at_k: number | null;
  };
  results: EvaluationResult[];
}

export interface FeedbackPayload {
  messageId: string;
  question: string;
  answer: string;
  rating: 'up' | 'down';
  comment?: string;
  timestamp: string;
}

const parseError = async (res: Response, defaultMessage: string): Promise<string> => {
  try {
    const err = await res.json();
    if (typeof err.detail === 'string') {
      return err.detail;
    } else if (Array.isArray(err.detail)) {
      return err.detail.map((d: any) => {
        const field = d.loc ? d.loc[d.loc.length - 1] : '';
        return field ? `${field}: ${d.msg}` : d.msg;
      }).join(', ');
    } else if (err.message) {
      return err.message;
    }
  } catch (e) {
    try {
      const text = await res.text();
      if (text) return text.substring(0, 150);
    } catch (_) {}
  }
  return `${defaultMessage} (${res.status} ${res.statusText})`;
};

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Login failed');
      throw new Error(message);
    }
    
    const data = await res.json();
    localStorage.setItem('mrp_token', data.access_token);
    return data;
  },

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Registration failed');
      throw new Error(message);
    }
    
    const data = await res.json();
    localStorage.setItem('mrp_token', data.access_token);
    return data;
  },

  async me(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      localStorage.removeItem('mrp_token');
      throw new Error('Session expired');
    }
    
    return res.json();
  },

  logout() {
    localStorage.removeItem('mrp_token');
  },

  // RAG Query
  async ask(question: string, template = 'chat'): Promise<AskResult> {
    const res = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ question, template }),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Failed to get answer');
      throw new Error(message);
    }
    
    return res.json();
  },

  // Document Uploads
  async uploadFile(file: File, onProgress?: (pct: number) => void): Promise<{ filename: string; current_document: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (onProgress) onProgress(30);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    if (onProgress) onProgress(80);
    
    if (!res.ok) {
      const message = await parseError(res, 'File upload failed');
      throw new Error(message);
    }
    
    if (onProgress) onProgress(100);
    return res.json();
  },

  async listUploads(): Promise<{ files: UploadedFile[]; count: number }> {
    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Failed to retrieve file list');
      throw new Error(message);
    }
    
    return res.json();
  },

  async deleteUpload(filename: string): Promise<any> {
    const res = await fetch(`${API_BASE}/uploads/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Failed to delete file');
      throw new Error(message);
    }
    
    return res.json();
  },

  async currentDocument(): Promise<{ filename: string | null; size?: number; last_modified?: number; status?: string }> {
    const res = await fetch(`${API_BASE}/current-document`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Failed to fetch active document status');
      throw new Error(message);
    }
    
    const data = await res.json();
    return {
      filename: data.filename || null,
      size: data.size,
      last_modified: data.last_modified,
      status: data.status
    };
  },

  // Evaluation
  async getEvaluation(): Promise<EvaluationReport> {
    const res = await fetch(`${API_BASE}/evaluation`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Failed to fetch evaluation results');
      throw new Error(message);
    }
    
    return res.json();
  },

  async runEvaluation(): Promise<EvaluationReport> {
    const res = await fetch(`${API_BASE}/evaluation/run`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const message = await parseError(res, 'Failed to execute evaluation');
      throw new Error(message);
    }
    
    return res.json();
  },

  // Feedback
  async submitFeedback(payload: FeedbackPayload): Promise<void> {
    // Save locally first so feedback is never lost, even if the backend
    // route below isn't available yet.
    try {
      const key = 'mrp_feedback_log';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(payload);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (_) {
      // localStorage unavailable — ignore
    }

    // Best-effort call to the backend. If /api/feedback isn't implemented
    // yet, fail silently so the UI experience isn't affected.
    try {
      await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (_) {
      // Backend endpoint not implemented yet — feedback is still saved locally above.
    }
  },

  // Best-effort fetch of feedback stored on the backend (if that route exists).
  // Returns [] instead of throwing so callers can safely merge with local data.
  async getFeedback(): Promise<FeedbackPayload[]> {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data.feedback || [];
    } catch (_) {
      return [];
    }
  }
};