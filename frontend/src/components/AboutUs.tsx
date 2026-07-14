import React, { useState, useEffect } from 'react';
import { Sparkles, Code, Play, Award, Users, ShieldAlert, Cpu } from 'lucide-react';
import { api, type EvaluationReport } from '../api';

export const AboutUs: React.FC = () => {
  const [evalReport, setEvalReport] = useState<EvaluationReport | null>(null);
  const [runningEval, setRunningEval] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvalData = async () => {
    try {
      const data = await api.getEvaluation();
      setEvalReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch evaluation metrics.');
    }
  };

  useEffect(() => {
    fetchEvalData();
  }, []);

  // Poll evaluation status if running
  useEffect(() => {
    let intervalId: any;
    
    if (runningEval || (evalReport && evalReport.status === 'in_progress')) {
      intervalId = setInterval(async () => {
        try {
          const data = await api.getEvaluation();
          setEvalReport(data);
          if (data.status === 'completed' || data.status === 'paused') {
            setRunningEval(false);
          }
        } catch (err) {
          console.error('Polling error', err);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [runningEval, evalReport]);

  const handleRunEvaluation = async () => {
    setRunningEval(true);
    setError(null);
    try {
      const data = await api.runEvaluation();
      setEvalReport(data);
      if (data.status === 'completed' || data.status === 'paused') {
        setRunningEval(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start evaluation.');
      setRunningEval(false);
    }
  };

  const getScoreClass = (score: number | null) => {
    if (score === null) return 'low';
    if (score >= 0.8) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  };

  const formatScore = (score: number | null) => {
    if (score === null) return 'N/A';
    return (score * 100).toFixed(1) + '%';
  };

  const isProgressing = !!(runningEval || (evalReport && evalReport.status === 'in_progress'));

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div>
          <h1 className="page-title">
            <Users color="var(--color-primary)" />
            About Us & Evaluation Dashboard
          </h1>
          <p className="page-description">
            MRP (Medical Research Paper) RAG system architecture overview & automated quality metrics evaluator.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="about-grid">
        {/* Info Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* About Section */}
          <div className="glass-card about-card">
            <h2 className="about-section-title">
              <Sparkles size={20} color="var(--color-primary)" />
              System Architecture & Methodology
            </h2>
            <p className="about-text">
              The <strong>MRP Medical RAG Platform</strong> is an advanced Retrieval-Augmented Generation (RAG) platform tailored for medical researchers, biomedical practitioners, and academic writers. It uses deep language models and semantic retrieval engines to extract evidence-based facts from dense medical PDFs and studies.
            </p>
            <p className="about-text">
              Our backend splits documents using optimized overlapping sentence chunking, embeds text segments with advanced SentenceTransformers models, indexes them inside Qdrant/Chroma collections, and performs intent-routing queries using Gemini models. This ensures high factual alignment and minimizes hallucinated responses.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <Code className="feature-icon" size={20} />
                <h4>Intent Query Router</h4>
                <p>Categorizes prompts as general chat, document searches, or comparative literature reviews.</p>
              </div>

              <div className="feature-item">
                <Cpu className="feature-icon" size={20} />
                <h4>Hybrid Semantic Retrieval</h4>
                <p>Retrieves key biomedical contexts using combined semantic vector scoring and keyword weighting.</p>
              </div>

              <div className="feature-item">
                <Award className="feature-icon" size={20} />
                <h4>Evaluation Pipeline</h4>
                <p>Factual validator comparing generation output against key medical gold-standard ground truth.</p>
              </div>
            </div>
          </div>

          {/* Evaluation Progress Card */}
          {evalReport && (
            <div className="glass-card eval-progress-card">
              <div className="eval-progress-header">
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Evaluation Job Status</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Status: <strong style={{ color: isProgressing ? 'var(--color-primary)' : 'var(--color-success)' }}>
                      {evalReport.status.toUpperCase()}
                    </strong>
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleRunEvaluation}
                  disabled={isProgressing}
                >
                  <Play size={14} />
                  {isProgressing ? 'Evaluating...' : 'Run/Resume Evaluation'}
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                  <span>Question Evaluation Progress</span>
                  <span>{evalReport.completed_questions} / {evalReport.total_questions} Questions</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${evalReport.total_questions > 0 ? (evalReport.completed_questions / evalReport.total_questions) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed results */}
          {evalReport && evalReport.results && evalReport.results.length > 0 && (
            <div className="glass-card eval-results-card">
              <h3 className="eval-results-title">Factual Accuracy Evaluation Log</h3>
              
              <div className="results-table-container">
                <table className="eval-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Reference Answer</th>
                      <th>Model Output</th>
                      <th>Keyword Recall</th>
                      <th>Precision</th>
                      <th>Recall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evalReport.results.map((res, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '200px' }}>{res.question}</td>
                        <td style={{ color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '200px' }}>{res.reference_answer}</td>
                        <td style={{ color: 'var(--text-muted)', maxWidth: '220px' }}>{res.generated_answer}</td>
                        <td>
                          <span className={`score-badge ${getScoreClass(res.keyword_recall)}`}>
                            {formatScore(res.keyword_recall)}
                          </span>
                        </td>
                        <td>
                          <span className={`score-badge ${getScoreClass(res.precision)}`}>
                            {formatScore(res.precision)}
                          </span>
                        </td>
                        <td>
                          <span className={`score-badge ${getScoreClass(res.recall)}`}>
                            {formatScore(res.recall)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tech stack card */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.15rem' }}>Engine Stack</h3>
            <div className="tech-stack-list">
              <div className="tech-item">
                <div className="tech-icon-container">F</div>
                <div className="tech-details">
                  <h4>FastAPI</h4>
                  <p>Asynchronous High-Perf Python API</p>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon-container">Q</div>
                <div className="tech-details">
                  <h4>Qdrant / Chroma</h4>
                  <p>Vector Similarity DB Collection</p>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon-container">G</div>
                <div className="tech-details">
                  <h4>Gemini models</h4>
                  <p>Medical Reasoning LLM Generator</p>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon-container">R</div>
                <div className="tech-details">
                  <h4>React 19 + TypeScript</h4>
                  <p>Client Web Assistant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics summary */}
          {evalReport && evalReport.summary && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.15rem' }}>Average Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div className="metric-label">Avg Keyword Recall</div>
                  <div className="metric-value">
                    {evalReport.summary.average_keyword_recall !== null 
                      ? (evalReport.summary.average_keyword_recall * 100).toFixed(1) + '%' 
                      : 'N/A'
                    }
                  </div>
                  <div className="metric-description">Matches targeted terms in reference answers.</div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="metric-label">Avg Precision @ K</div>
                  <div className="metric-value" style={{ color: 'var(--color-secondary)' }}>
                    {evalReport.summary.average_precision_at_k !== null 
                      ? (evalReport.summary.average_precision_at_k * 100).toFixed(1) + '%' 
                      : 'N/A'
                    }
                  </div>
                  <div className="metric-description">Factual precision of retrieved vector contexts.</div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="metric-label">Avg Recall @ K</div>
                  <div className="metric-value" style={{ color: 'var(--color-success)' }}>
                    {evalReport.summary.average_recall_at_k !== null 
                      ? (evalReport.summary.average_recall_at_k * 100).toFixed(1) + '%' 
                      : 'N/A'
                    }
                  </div>
                  <div className="metric-description">Coverage score of search context to question.</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
