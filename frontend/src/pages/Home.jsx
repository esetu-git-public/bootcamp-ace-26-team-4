import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">

          <h1>Medical Research Paper Assistant</h1>

          <p className="hero-text">
            Upload medical research papers, search clinical information,
            and interact with an AI assistant to better understand
            research findings and evidence-based guidelines.
          </p>

          <div className="hero-buttons">
            <Link to="/upload" className="hero-link">
              <button className="btn primary-btn">
                📤 Upload Papers
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
    </div>
  );
}

export default Home;