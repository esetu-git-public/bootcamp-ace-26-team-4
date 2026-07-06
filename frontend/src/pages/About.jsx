import "../styles/About.css";

function About() {
  return (
    <div className="about-container">

      <div className="about-header">
        <h1>About Medical Research Paper Assistant</h1>

        <p>
          A web application that helps healthcare professionals,
          researchers, and students upload, search, and interact with
          medical research papers using Artificial Intelligence.
        </p>
      </div>

      <div className="about-grid">

        <div className="about-card">
          <h2>🎯 Our Mission</h2>

          <p>
            To simplify medical research by providing an intelligent
            platform for document management and AI-powered knowledge
            retrieval.
          </p>
        </div>

        <div className="about-card">
          <h2>✨ Key Features</h2>

          <ul>
            <li>Upload PDF research papers</li>
            <li>Search medical literature</li>
            <li>AI-powered research assistant</li>
            <li>Secure document management</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>💻 Technology Stack</h2>

          <ul>
            <li>Frontend – React + Vite</li>
            <li>Backend – Spring Boot</li>
            <li>Database – PostgreSQL</li>
            <li>AI – Retrieval-Augmented Generation (RAG)</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>📌 Project Goal</h2>

          <p>
            Build an intelligent platform that enables users to
            efficiently explore medical research papers and obtain
            accurate, evidence-based insights.
          </p>
        </div>

      </div>

    </div>
  );
}

export default About;