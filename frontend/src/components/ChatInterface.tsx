import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { api, type AskResult } from '../api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  metadata?: AskResult['metadata'];
  references?: AskResult['references'];
  claim_mapping?: any;
}

interface ChatInterfaceProps {
  activeDoc: string | null;
  onDocChange: () => void;
}

const renderFormattedText = (lineText: string, keyPrefix: string) => {
  const actualBoldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  const parts: { type: 'text' | 'bold'; content: string }[] = [];
  
  while ((match = actualBoldRegex.exec(lineText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: lineText.substring(lastIndex, match.index) });
    }
    parts.push({ type: 'bold', content: match[1] });
    lastIndex = actualBoldRegex.lastIndex;
  }
  if (lastIndex < lineText.length) {
    parts.push({ type: 'text', content: lineText.substring(lastIndex) });
  }
  
  if (parts.length === 0) {
    parts.push({ type: 'text', content: lineText });
  }

  const finalElements: React.ReactNode[] = [];
  
  parts.forEach((part, partIdx) => {
    if (part.type === 'bold') {
      finalElements.push(
        <strong key={`${keyPrefix}-bold-${partIdx}`} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
          {part.content}
        </strong>
      );
    } else {
      const citationRegex = /\[(\d+(?:\s*,\s*[^\]]+)?)\]/g;
      let citLastIdx = 0;
      let citMatch;
      
      while ((citMatch = citationRegex.exec(part.content)) !== null) {
        if (citMatch.index > citLastIdx) {
          finalElements.push(part.content.substring(citLastIdx, citMatch.index));
        }
        
        const citationVal = citMatch[0];
        finalElements.push(
          <span 
            key={`${keyPrefix}-cit-${partIdx}-${citMatch.index}`} 
            style={{ 
              color: 'var(--color-primary)', 
              background: 'rgba(0, 242, 254, 0.08)', 
              border: '1px solid rgba(0, 242, 254, 0.25)',
              padding: '1px 5px', 
              borderRadius: '4px', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              margin: '0 2px',
              display: 'inline-block',
              lineHeight: '1.2'
            }}
          >
            {citationVal}
          </span>
        );
        citLastIdx = citationRegex.lastIndex;
      }
      
      if (citLastIdx < part.content.length) {
        finalElements.push(part.content.substring(citLastIdx));
      }
    }
  });

  return finalElements;
};

const parseMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      if (inList) {
        elements.push(<ul key={`list-${i}`} style={{ marginBottom: '12px', paddingLeft: '20px', listStyleType: 'disc' }}>{listItems}</ul>);
        inList = false;
        listItems = [];
      }
      elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />);
      continue;
    }
    
    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) {
        elements.push(<ul key={`list-${i}`} style={{ marginBottom: '12px', paddingLeft: '20px', listStyleType: 'disc' }}>{listItems}</ul>);
        inList = false;
        listItems = [];
      }
      const level = headingMatch[1].length;
      const headingContent = renderFormattedText(headingMatch[2], `h-${i}`);
      const hStyle = { marginTop: '16px', marginBottom: '8px', color: 'var(--text-primary)' };
      if (level === 1) elements.push(<h1 key={`h-${i}`} style={{ ...hStyle, fontSize: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>{headingContent}</h1>);
      else if (level === 2) elements.push(<h2 key={`h-${i}`} style={{ ...hStyle, fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>{headingContent}</h2>);
      else if (level === 3) elements.push(<h3 key={`h-${i}`} style={{ ...hStyle, fontSize: '1.1rem' }}>{headingContent}</h3>);
      else elements.push(<h4 key={`h-${i}`} style={{ ...hStyle, fontSize: '1rem' }}>{headingContent}</h4>);
      continue;
    }
    
    // Bullet Lists
    const listMatch = line.match(/^(\*|-|\+)\s+(.*)$/);
    if (listMatch) {
      inList = true;
      listItems.push(
        <li key={`li-${i}-${listItems.length}`} style={{ marginBottom: '4px' }}>
          {renderFormattedText(listMatch[2], `li-${i}`)}
        </li>
      );
      continue;
    }
    
    // End of list detection
    if (line.trim() === '' && inList) {
      elements.push(<ul key={`list-${i}`} style={{ marginBottom: '12px', paddingLeft: '20px', listStyleType: 'disc' }}>{listItems}</ul>);
      inList = false;
      listItems = [];
      continue;
    }
    
    // Plain paragraphs
    if (line.trim() !== '') {
      if (inList) {
        elements.push(<ul key={`list-${i}`} style={{ marginBottom: '12px', paddingLeft: '20px', listStyleType: 'disc' }}>{listItems}</ul>);
        inList = false;
        listItems = [];
      }
      elements.push(
        <p key={`p-${i}`} style={{ marginBottom: '8px', lineHeight: '1.5' }}>
          {renderFormattedText(line, `p-${i}`)}
        </p>
      );
    }
  }
  
  if (inList) {
    elements.push(<ul key="list-final" style={{ marginBottom: '12px', paddingLeft: '20px', listStyleType: 'disc' }}>{listItems}</ul>);
  }
  
  return elements;
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeDoc, onDocChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [template, setTemplate] = useState<'chat' | 'summary' | 'compare'>('chat');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await api.ask(textToSend, template);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date(),
        metadata: response.metadata,
        references: response.references,
        claim_mapping: response.claim_mapping
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size and type
    const allowed = ['.pdf', '.docx', '.txt', '.md', '.csv', '.xml'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setError('Unsupported file type. Please upload PDF, DOCX, TXT, MD, CSV, or XML.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await api.uploadFile(file);
      onDocChange();
      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `Successfully uploaded and indexed "${file.name}". You can now ask questions specifically about this document.`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and index document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCardClick = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header glass-panel">
        <div className="chat-header-title">Research Assistant</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {uploading && <div className="doc-pill" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', background: 'rgba(0, 242, 254, 0.05)' }}>Uploading & Indexing...</div>}
          {activeDoc ? (
            <div className="doc-pill">
              <CheckCircle2 size={14} />
              <span>Paper: {activeDoc}</span>
            </div>
          ) : (
            <div className="doc-pill" style={{ background: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.25)', color: 'var(--color-danger)' }}>
              No document uploaded
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-logo">
              <Sparkles size={32} />
            </div>
            <h1 className="welcome-title">Medical Research Paper Assistant</h1>
            <p className="welcome-subtitle">
              Upload medical papers or ask general biomedical research queries using custom retrieval templates.
            </p>
            
            <div className="welcome-grid">
              <div className="glass-card welcome-card" onClick={() => handleCardClick("What percentages of participants were male and female in the Eastern Region study?")}>
                <h3>
                  <Sparkles size={16} color="var(--color-primary)" />
                  Participant Stats
                </h3>
                <p>"What percentages of participants were male and female?"</p>
              </div>

              <div className="glass-card welcome-card" onClick={() => handleCardClick("What was the average overall knowledge score and maximum possible score in the heart attack risk factor study?")}>
                <h3>
                  <Sparkles size={16} color="var(--color-primary)" />
                  Research Scores
                </h3>
                <p>"What was the average overall knowledge score and maximum possible score?"</p>
              </div>

              <div className="glass-card welcome-card" onClick={() => handleCardClick("What was the final sample size, targeted age group, and sampling technique used?")}>
                <h3>
                  <Sparkles size={16} color="var(--color-primary)" />
                  Methodology
                </h3>
                <p>"What was the final sample size, targeted age group, and sampling technique?"</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'user' ? 'U' : <Sparkles size={18} />}
              </div>
              <div className="message-content-wrapper">
                <div className="message-bubble">
                  {msg.sender === 'assistant' ? parseMarkdown(msg.text) : msg.text}
                </div>
                
                {/* References */}
                {msg.references && msg.references.length > 0 && (
                  <div className="citations-container">
                    <div className="citations-title">
                      <FileText size={14} />
                      <span>Retrieved Source Citations ({msg.references.length})</span>
                    </div>
                    <div className="citation-list">
                      {msg.references.map((ref, idx) => (
                        <div key={idx} className="citation-item">
                          <div className="citation-source">
                            [{idx + 1}] {ref.title || ref.source_file || ref.filename || 'Unknown Document'} ({ref.journal || 'Uploaded Doc'} - {ref.publication_year || 'N/A'})
                          </div>
                          {ref.text && (
                            <div className="citation-text">
                              "{ref.text.length > 220 ? ref.text.slice(0, 220) + '...' : ref.text}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {msg.metadata && (
                  <div className="message-metadata">
                    <span className="meta-badge">
                      Template: <strong>{msg.metadata.template}</strong>
                    </span>
                    <span className="meta-badge">
                      Route: <strong>{msg.metadata.route || msg.metadata.intent || 'RAG'}</strong>
                    </span>
                    <span className="meta-badge">
                      Chunks: <strong>{msg.metadata.retrieved_chunks}</strong>
                    </span>
                    <span className="meta-badge">
                      Confidence: <strong>{msg.metadata.retrieval_confidence_level} ({Math.round((msg.metadata.retrieval_confidence_score || 0) * 100)}%)</strong>
                    </span>
                    {msg.metadata.final_score !== undefined && (
                      <span className="meta-badge" style={{ color: 'var(--color-primary)' }}>
                        Score: <strong>{msg.metadata.final_score}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="message-row assistant">
            <div className="message-avatar">
              <Sparkles size={18} />
            </div>
            <div className="message-content-wrapper">
              <div className="typing-loader">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner" style={{ margin: '20px 0 0 0' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <div className="chat-input-row">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="file-input-hidden"
              accept=".pdf,.docx,.txt,.md,.csv,.xml"
            />
            <button 
              type="button" 
              className="chat-action-btn"
              title="Upload PDF or document to index"
              onClick={handleFileUploadClick}
              disabled={uploading}
            >
              <Upload size={20} />
            </button>
            
            <input
              type="text"
              placeholder="Ask a medical query or query uploaded research paper..."
              className="chat-input-textbox"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            
            <button 
              type="button" 
              className="chat-action-btn chat-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div className="template-selector">
              <button
                type="button"
                className={`template-btn ${template === 'chat' ? 'active' : ''}`}
                onClick={() => setTemplate('chat')}
              >
                Chat RAG
              </button>
              <button
                type="button"
                className={`template-btn ${template === 'summary' ? 'active' : ''}`}
                onClick={() => setTemplate('summary')}
              >
                Summarize
              </button>
              <button
                type="button"
                className={`template-btn ${template === 'compare' ? 'active' : ''}`}
                onClick={() => setTemplate('compare')}
              >
                Compare Study
              </button>
            </div>
            
            {activeDoc && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Targeting: <strong>{activeDoc}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
