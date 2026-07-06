import "../styles/About.css";

function About() {
  return (
    <div className="about-container">

      <section className="about-hero">
        <h1>About Medical Research Paper Assistant</h1>
        <p>
          An AI-powered platform that helps researchers, students, and healthcare
          professionals upload, search, and understand medical research papers
          efficiently using Retrieval-Augmented Generation (RAG).
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to simplify access to medical knowledge by combining
          Artificial Intelligence with research literature, enabling users to
          quickly retrieve accurate and relevant information.
        </p>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>

        <div className="feature-grid">

          <div className="feature-box">
            <h3>📄 Upload Papers</h3>
            <p>
              Upload research papers, journals, and clinical guidelines securely.
            </p>
          </div>

          <div className="feature-box">
            <h3>🔍 Smart Search</h3>
            <p>
              Find relevant information quickly using keyword and semantic search.
            </p>
          </div>

          <div className="feature-box">
            <h3>🤖 AI Chat Assistant</h3>
            <p>
              Ask questions about uploaded papers and receive AI-generated
              responses with contextual understanding.
            </p>
          </div>

          <div className="feature-box">
            <h3>📚 Research Support</h3>
            <p>
              Save time by retrieving summaries and important insights from
              medical documents.
            </p>
          </div>

        </div>
      </section>

      <section className="about-section">
        <h2>Technology Stack</h2>

        <div className="tech-stack">

          <span>React</span>
          <span>FastAPI</span>
          <span>Python</span>
          <span>MongoDB</span>
          <span>LangChain</span>
          <span>RAG</span>

        </div>

      </section>

    </div>
  );
}

export default About;