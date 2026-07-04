import "./App.css";
function App() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Medical Research Paper Assistant</h1>
          <p>
            Upload research papers, search important medical information, and
            chat with an AI assistant to understand clinical guidelines and
            research findings easily.
          </p>

          <div className="hero-buttons">
            <button className="btn primary-btn">Upload Papers</button>
            <button className="btn secondary-btn">Search Papers</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Upload Papers</h3>
            <p>
              Upload medical research papers, journals, and clinical documents
              in one place for easy access.
            </p>
          </div>

          <div className="feature-card">
            <h3>Hybrid Search</h3>
            <p>
              Search across uploaded documents using keywords and semantic
              search to find the most relevant information quickly.
            </p>
          </div>

          <div className="feature-card">
            <h3>AI Assistant</h3>
            <p>
              Ask questions about research papers and clinical guidelines and
              get instant AI-generated answers.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <h2>How It Works</h2>
        <div className="workflow-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Upload research papers, PDFs, and medical guidelines.</p>
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
              Search and retrieve the most relevant content from your document
              collection.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Generate</h3>
            <p>
              Get AI-powered responses and summaries based on the retrieved
              research information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;