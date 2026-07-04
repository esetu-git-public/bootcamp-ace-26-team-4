import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-badge">AI-Powered Medical Research Support</p>
          <h1>Medical Research Paper Assistant</h1>
          <p className="hero-text">
            Upload medical research papers, search clinical knowledge quickly,
            and ask questions to an AI assistant for faster understanding of
            research findings and guidelines.
          </p>

          <div className="hero-buttons">
            <Link to="/upload" className="hero-link">
              <button className="btn primary-btn">Upload Papers</button>
            </Link>

            <Link to="/search" className="hero-link">
              <button className="btn secondary-btn">Search Papers</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <p className="section-subtitle">
          A simple research assistant interface for uploading, searching, and
          understanding medical documents.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Upload Papers</h3>
            <p>
              Upload research papers, journals, PDFs, and clinical guideline
              documents in one place for organized access.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔎</div>
            <h3>Hybrid Search</h3>
            <p>
              Find relevant content using keyword search and semantic retrieval
              for better accuracy across uploaded documents.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>
              Ask questions about uploaded research papers and receive
              AI-generated answers, summaries, and insights.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <h2>How It Works</h2>
        <p className="section-subtitle">
          The system follows a simple workflow to help users interact with
          medical research papers efficiently.
        </p>

        <div className="workflow-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Upload medical papers, PDFs, and clinical guideline documents.</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Index</h3>
            <p>The system processes and organizes the uploaded documents.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Retrieve</h3>
            <p>
              Search and retrieve the most relevant information from your
              uploaded document collection.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Generate</h3>
            <p>
              Generate AI-powered answers, explanations, and summaries based on
              retrieved research content.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;