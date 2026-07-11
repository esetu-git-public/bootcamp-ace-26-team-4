import React from "react";
import { Link } from "react-router-dom";
import {
  FaRobot,
  FaSearch,
  FaFileMedical,
  FaCheckCircle,
  FaDatabase,
  FaBookMedical,
} from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home">

      {/* Hero Section */}

      <section className="hero">
        <div className="hero-content">
          <h1>Medical Research Paper Assistant</h1>

<<<<<<< HEAD
          <p className="hero-text">
            Welcome to the Medical Research Paper Assistant.
            Search clinical literature and interact with an AI assistant
            to better understand evidence-based medical knowledge.
            You can upload documents directly inside the AI Assistant.
=======
          <p>
            Ask intelligent questions over medical research papers and
            clinical guidelines with AI-powered answers and reliable
            source references.
>>>>>>> 8f90d63 (Enhance registration page with validation and UX improvements)
          </p>

          <div className="hero-buttons">
            <Link to="/chat" className="primary-btn">
              Open AI Assistant
            </Link>

            <Link to="/search" className="secondary-btn">
              Search Papers
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}

      <section className="features">

        <h2>Core Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <FaFileMedical className="feature-icon" />
            <h3>Upload & Analyze</h3>
            <p>
              Upload medical research papers and interact with them
              using natural language.
            </p>
          </div>

          <div className="feature-card">
            <FaSearch className="feature-icon" />
            <h3>Advanced Search</h3>
            <p>
              Search research papers using keywords,
              topics and metadata filters.
            </p>
          </div>

          <div className="feature-card">
            <FaRobot className="feature-icon" />
            <h3>AI Assistant</h3>
            <p>
              Get accurate answers with citations
              and supporting evidence.
            </p>
          </div>

        </div>

      </section>

      {/* Workflow */}

      <section className="workflow">

        <h2>How It Works</h2>

<<<<<<< HEAD
          <Link to="/search" className="quick-card">
            <h3>🔍 Search Papers</h3>

            <p>
              Search medical literature instantly.
            </p>
          </Link>
=======
        <div className="workflow-container">

          <div className="workflow-step">
            Upload Paper
          </div>

          <span>➜</span>

          <div className="workflow-step">
            Index Document
          </div>
>>>>>>> 8f90d63 (Enhance registration page with validation and UX improvements)

          <span>➜</span>

<<<<<<< HEAD
            <p>
              Upload a document and ask questions using AI.
            </p>
          </Link>
=======
          <div className="workflow-step">
            Ask Questions
          </div>
>>>>>>> 8f90d63 (Enhance registration page with validation and UX improvements)

          <span>➜</span>

          <div className="workflow-step">
            AI Answers
          </div>

          <span>➜</span>

          <div className="workflow-step">
            References
          </div>

        </div>

      </section>

      {/* Why Choose */}

      <section className="why">

        <h2>Why Choose This Assistant?</h2>

        <div className="why-grid">

          <div className="why-card">
            <FaCheckCircle />
            Accurate Responses
          </div>

          <div className="why-card">
            <FaBookMedical />
            Source References
          </div>

          <div className="why-card">
            <FaDatabase />
            Fast Retrieval
          </div>

          <div className="why-card">
            <FaRobot />
            Medical Focused AI
          </div>

          <div className="why-card">
            <FaCheckCircle />
            Easy to Use
          </div>

          <div className="why-card">
            <FaFileMedical />
            Secure Processing
          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="stats">

        <div className="stat-card">
          <h2>1000+</h2>
          <p>Research Papers Supported</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>AI Assistance</p>
        </div>

        <div className="stat-card">
          <h2>Fast</h2>
          <p>Document Retrieval</p>
        </div>

        <div className="stat-card">
          <h2>100%</h2>
          <p>Source Citations</p>
        </div>

      </section>

      {/* Footer */}

      <footer className="footer">

        <h3>Medical Research Paper Assistant</h3>

        <p>Built using React • FastAPI • RAG Pipeline</p>

        <p>© 2026 All Rights Reserved.</p>

      </footer>

    </div>
  );
};

export default Home;