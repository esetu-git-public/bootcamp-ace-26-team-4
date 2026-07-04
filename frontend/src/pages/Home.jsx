import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Medical Research Paper Assistant</h1>
          <p>
            Upload research papers, search important medical information, and
            chat with an AI assistant.
          </p>

          <div className="hero-buttons">
            <button
              className="btn primary-btn"
              onClick={() => navigate("/upload")}
            >
              Upload Papers
            </button>

            <button
              className="btn secondary-btn"
              onClick={() => navigate("/search")}
            >
              Search Papers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;