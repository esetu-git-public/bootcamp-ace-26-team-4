import {
  FaRobot,
  FaDatabase,
  FaBrain,
  FaSearch,
  FaGithub,
  FaServer,
} from "react-icons/fa";

import "../styles/About.css";

function About() {
  return (
    <div className="about-page">

      <div className="about-hero">

        <h1>🩺 Medical Research Paper Assistant</h1>

        <p>
          An AI-powered Medical Research Assistant that uses
          Retrieval-Augmented Generation (RAG) with Gemini AI
          to answer questions from medical research papers.
        </p>

      </div>

      <div className="tech-grid">

        <div className="tech-card">
          <FaRobot />
          <h3>Gemini AI</h3>
          <p>Generates intelligent responses.</p>
        </div>

        <div className="tech-card">
          <FaSearch />
          <h3>Hybrid Search</h3>
          <p>Vector Search + BM25 Retrieval.</p>
        </div>

        <div className="tech-card">
          <FaDatabase />
          <h3>Vector Database</h3>
          <p>Stores indexed document embeddings.</p>
        </div>

        <div className="tech-card">
          <FaServer />
          <h3>FastAPI</h3>
          <p>Backend API for AI services.</p>
        </div>

        <div className="tech-card">
          <FaBrain />
          <h3>RAG Pipeline</h3>
          <p>Context-aware medical question answering.</p>
        </div>

        <div className="tech-card">
          <FaGithub />
          <h3>GitHub</h3>
          <p>Version control and collaboration.</p>
        </div>

      </div>

      <div className="workflow">

        <h2>System Workflow</h2>

        <div className="workflow-box">

          Upload Paper

          <span>➜</span>

          Preprocessing

          <span>➜</span>

          Embeddings

          <span>➜</span>

          Vector Database

          <span>➜</span>

          Gemini AI

          <span>➜</span>

          Response

        </div>

      </div>

    </div>
  );
}

export default About;