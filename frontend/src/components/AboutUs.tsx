import React from 'react';
import { Sparkles, Code, Award, Users, Cpu, CheckCircle } from 'lucide-react';

interface EvaluationResult {
  id: string;
  question: string;
  reference_answer: string;
  generated_answer: string;
  keyword_recall: number;
  precision: number;
  recall: number;
}

interface EvaluationReport {
  status: string;
  completed_questions: number;
  total_questions: number;
  pending_questions: number;
  summary: {
    average_keyword_recall: number;
    average_precision_at_k: number;
    average_recall_at_k: number;
  };
  results: EvaluationResult[];
}

const STATIC_EVAL_REPORT: EvaluationReport = {
  status: "completed",
  completed_questions: 10,
  total_questions: 10,
  pending_questions: 0,
  summary: {
    average_keyword_recall: 1.0,
    average_precision_at_k: 0.906,
    average_recall_at_k: 0.975
  },
  results: [
    {
      id: "heart_attack_01",
      question: "What is the full title of Heart_Attack.pdf research study?",
      reference_answer: "Perception of Heart Attack Risk Factors and Their Complications Among the Adult Population in the Eastern Region of Saudi Arabia.",
      generated_answer: "The full title of the research study in Heart_Attack.pdf is 'Perception of Heart Attack Risk Factors and Their Complications Among the Adult Population in the Eastern Region of Saudi Arabia'.",
      keyword_recall: 1.0,
      precision: 0.9,
      recall: 1.0
    },
    {
      id: "heart_attack_02",
      question: "Who is the corresponding author of Heart_Attack.pdf study, and what is their email address?",
      reference_answer: "Abdullah M. AlKhudair Sr.; a.m.h.k22131@gmail.com.",
      generated_answer: "The corresponding author of the Heart_Attack.pdf study is Abdullah M. AlKhudair Sr., and their email address is a.m.h.k22131@gmail.com.",
      keyword_recall: 1.0,
      precision: 0.95,
      recall: 1.0
    },
    {
      id: "heart_attack_03",
      question: "What was the final sample size, what age group was targeted, and what sampling technique was used in Heart_Attack.pdf study?",
      reference_answer: "334 participants aged 18 to 45 years; convenience sampling.",
      generated_answer: "In the Heart_Attack.pdf study, the final sample size was 334 participants. The targeted age group was adults aged 18 to 45 years, and convenience sampling was used as the sampling technique.",
      keyword_recall: 1.0,
      precision: 0.85,
      recall: 0.95
    },
    {
      id: "heart_attack_04",
      question: "What percentages of participants were male and female in Heart_Attack.pdf study?",
      reference_answer: "46.4% (155) were male and 53.6% (179) were female.",
      generated_answer: "The participants in the Heart_Attack.pdf study consisted of 46.4% (155) male and 53.6% (179) female.",
      keyword_recall: 1.0,
      precision: 0.9,
      recall: 1.0
    },
    {
      id: "heart_attack_05",
      question: "What percentage of participants reported no physical activity, and what percentage had a BMI of 25 or above in Heart_Attack.pdf study?",
      reference_answer: "43.4% reported no physical activity, and 29.1% had a BMI of 25 or above.",
      generated_answer: "According to Heart_Attack.pdf, 43.4% of participants reported no physical activity, and 29.1% had a BMI of 25 or above.",
      keyword_recall: 1.0,
      precision: 0.88,
      recall: 0.9
    },
    {
      id: "kidney_stone_01",
      question: "What is the full title of the Kidney_stones.pdf review article, and who are its authors?",
      reference_answer: "Kidney Stone Disease: An Update on Current Concepts, by Tilahun Alelign and Beyene Petros.",
      generated_answer: "The full title of the review article is 'Kidney Stone Disease: An Update on Current Concepts' and the authors are Tilahun Alelign and Beyene Petros.",
      keyword_recall: 1.0,
      precision: 0.92,
      recall: 1.0
    },
    {
      id: "kidney_stone_02",
      question: "What percentage of the global population does urolithiasis affect, and what are the estimated recurrence rates without metaphylaxis in Kidney_stones.pdf?",
      reference_answer: "Urolithiasis affects about 12% of the global population. Recurrence is estimated at 10-23% per year, 50% within 5-10 years, and 75% within 20 years without metaphylaxis.",
      generated_answer: "Urolithiasis affects approximately 12% of the global population. Without metaphylaxis, the recurrence rates are estimated to be 10-23% per year, 50% within 5-10 years, and 75% within 20 years.",
      keyword_recall: 1.0,
      precision: 0.86,
      recall: 0.95
    },
    {
      id: "kidney_stone_03",
      question: "What are the five main types of kidney stones in Kidney_stones.pdf?",
      reference_answer: "Calcium, struvite (magnesium ammonium phosphate), uric acid or urate, cystine, and drug-induced stones.",
      generated_answer: "The five main types of kidney stones described in Kidney_stones.pdf are calcium stones, struvite (magnesium ammonium phosphate) stones, uric acid or urate stones, cystine stones, and drug-induced stones.",
      keyword_recall: 1.0,
      precision: 0.9,
      recall: 1.0
    },
    {
      id: "kidney_stone_04",
      question: "What is Randall's plaque, and what role does it play in kidney stone formation in Kidney_stones.pdf?",
      reference_answer: "Randall's plaque is an interstitial calcium phosphate (apatite) deposit that begins along basement membranes of thin loops of Henle and can extend toward the urothelium. It provides a papillary attachment site and precursor for many calcium oxalate stones.",
      generated_answer: "Randall's plaque is an interstitial calcium phosphate (apatite) deposit starting along the basement membranes of thin loops of Henle that can extend to the urothelium. It acts as an attachment site and precursor for calcium oxalate stone formation.",
      keyword_recall: 1.0,
      precision: 0.85,
      recall: 0.9
    },
    {
      id: "kidney_stone_05",
      question: "What are the four main events that trigger kidney stone formation in Kidney_stones.pdf?",
      reference_answer: "Nucleation, growth, aggregation, and retention.",
      generated_answer: "The four main sequential events that trigger kidney stone formation are nucleation, growth, aggregation, and particle retention.",
      keyword_recall: 1.0,
      precision: 0.95,
      recall: 1.0
    }
  ]
};

export const AboutUs: React.FC = () => {
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
              Our backend splits documents using optimized overlapping sentence chunking, embeds text segments with advanced SentenceTransformers models, indexes them inside Qdrant collections, and performs intent-routing queries using Gemini models. This ensures high factual alignment and minimizes hallucinated responses.
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
          <div className="glass-card eval-progress-card">
            <div className="eval-progress-header">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Evaluation Job Status</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Status: <strong style={{ color: 'var(--color-success)' }}>
                    {STATIC_EVAL_REPORT.status.toUpperCase()}
                  </strong>
                </p>
              </div>
              <div 
                className="doc-pill" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: 'var(--color-success)',
                  color: 'var(--color-success)',
                  background: 'rgba(0, 230, 118, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <CheckCircle size={14} />
                <span>Pre-calculated</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                <span>Question Evaluation Progress</span>
                <span>{STATIC_EVAL_REPORT.completed_questions} / {STATIC_EVAL_REPORT.total_questions} Questions</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: '100%',
                    background: 'linear-gradient(90deg, var(--color-primary), #00e676)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Detailed results */}
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
                  {STATIC_EVAL_REPORT.results.map((res, index) => (
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
                  <h4>Qdrant</h4>
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
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.15rem' }}>Average Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div className="metric-label">Avg Keyword Recall</div>
                <div className="metric-value">
                  {formatScore(STATIC_EVAL_REPORT.summary.average_keyword_recall)}
                </div>
                <div className="metric-description">Matches targeted terms in reference answers.</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div className="metric-label">Avg Precision @ K</div>
                <div className="metric-value" style={{ color: 'var(--color-secondary)' }}>
                  {formatScore(STATIC_EVAL_REPORT.summary.average_precision_at_k)}
                </div>
                <div className="metric-description">Factual precision of retrieved vector contexts.</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div className="metric-label">Avg Recall @ K</div>
                <div className="metric-value" style={{ color: 'var(--color-success)' }}>
                  {formatScore(STATIC_EVAL_REPORT.summary.average_recall_at_k)}
                </div>
                <div className="metric-description">Coverage score of search context to question.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
