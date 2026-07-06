import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">

      {/* Welcome Section */}
      <section className="hero-section">
        <div className="hero-content">

          <h1>Medical Research Paper Assistant</h1>

          <p className="hero-text">
            Welcome to the Medical Research Paper Assistant. Upload research
            papers, search medical literature, and interact with AI to
            understand research findings and evidence-based clinical knowledge.
          </p>

          <div className="hero-buttons">
            <Link to="/upload" className="hero-link">
              <button className="btn primary-btn">
                📄 Upload Papers
              </button>
            </Link>

            <Link to="/search" className="hero-link">
              <button className="btn secondary-btn">
                🔍 Search Papers
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-section">

        <h2>Quick Access</h2>

        <div className="quick-grid">

          <Link to="/upload" className="quick-card">
            <h3>📄 Upload Research</h3>
            <p>Upload PDF research papers securely.</p>
          </Link>

          <Link to="/search" className="quick-card">
            <h3>🔍 Search Papers</h3>
            <p>Find relevant medical research instantly.</p>
          </Link>

          <Link to="/chat" className="quick-card">
            <h3>💬 AI Assistant</h3>
            <p>Ask questions about uploaded documents.</p>
          </Link>

          <Link to="/about" className="quick-card">
            <h3>ℹ️ About</h3>
            <p>Learn more about this platform.</p>
          </Link>

        </div>

      </section>

      {/* Features */}

      <section className="feature-section">

        <h2>Platform Features</h2>

        <div className="feature-grid">

          <div className="feature-box">
            📄 Secure PDF Upload
          </div>

          <div className="feature-box">
            🔍 Intelligent Research Search
          </div>

          <div className="feature-box">
            💬 AI-powered Question Answering
          </div>

          <div className="feature-box">
            📚 Medical Knowledge Retrieval
          </div>

        </div>

      </section>

      {/* Activity */}

      <section className="activity-section">

        <h2>Recent Activity</h2>

        <div className="activity-card">

          <p>No research papers uploaded yet.</p>

          <p>
            Upload your first medical research paper to begin using the
            platform.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Home;