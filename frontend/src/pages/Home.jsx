import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">

      <section className="hero-section">

        <div className="hero-content">

          <h1>Medical Research Paper Assistant</h1>

          <p className="hero-text">
            Welcome to the Medical Research Paper Assistant.
            Search clinical literature and interact with an AI assistant
            to better understand evidence-based medical knowledge.
            You can upload documents directly inside the AI Assistant.
          </p>

        </div>

      </section>

      <section className="quick-access">

        <h2>Quick Access</h2>

        <div className="card-grid">

          <Link to="/search" className="quick-card">
            <h3>🔍 Search Papers</h3>

            <p>
              Search medical literature instantly.
            </p>
          </Link>

          <Link to="/chat" className="quick-card">
            <h3>💬 AI Assistant</h3>

            <p>
              Upload a document and ask questions using AI.
            </p>
          </Link>

          <Link to="/about" className="quick-card">
            <h3>ℹ️ About</h3>

            <p>
              Learn more about this medical research platform.
            </p>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;