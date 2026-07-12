import {
  FaRobot,
  FaBrain,
  FaDatabase,
  FaSearch,
  FaServer,
  FaGithub,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/About.css";

function About() {

  const technologies = [

    {
      icon: <FaRobot />,
      title: "Gemini AI",
      description:
        "Uses Google's Gemini Large Language Model to generate accurate medical answers.",
    },

    {
      icon: <FaSearch />,
      title: "Hybrid Search",
      description:
        "Combines Vector Search and BM25 Retrieval for better document matching.",
    },

    {
      icon: <FaDatabase />,
      title: "Vector Database",
      description:
        "Stores document embeddings for semantic retrieval.",
    },

    {
      icon: <FaServer />,
      title: "FastAPI Backend",
      description:
        "Handles document upload, indexing and AI requests.",
    },

    {
      icon: <FaBrain />,
      title: "RAG Pipeline",
      description:
        "Retrieves relevant medical context before generating answers.",
    },

    {
      icon: <FaGithub />,
      title: "Git Collaboration",
      description:
        "Version control and collaborative development using GitHub.",
    },

  ];

  return (

    <div className="about-page fade-up">

      <section className="about-hero">

        <span className="about-badge">

          AI Powered Medical Platform

        </span>

        <h1>

          Medical Research Paper Assistant

        </h1>

        <p>

          This application combines Retrieval-Augmented Generation (RAG),
          Gemini AI, FastAPI and Vector Search to help doctors,
          researchers and students obtain reliable answers from
          medical research papers within seconds.

        </p>

      </section>

      <section>

        <h2 className="section-title">

          Technology Stack

        </h2>

        <div className="tech-grid">

          {

            technologies.map((tech,index)=>(

              <div
                className="tech-card"
                key={index}
              >

                <div className="tech-icon">

                  {tech.icon}

                </div>

                <h3>

                  {tech.title}

                </h3>

                <p>

                  {tech.description}

                </p>

              </div>

            ))

          }

        </div>

      </section>

      <section className="workflow-section">

        <h2 className="section-title">

          AI Workflow

        </h2>

        <div className="workflow">

          <div className="workflow-step">

            Upload Paper

          </div>

          <FaArrowRight />

          <div className="workflow-step">

            Text Extraction

          </div>

          <FaArrowRight />

          <div className="workflow-step">

            Embeddings

          </div>

          <FaArrowRight />

          <div className="workflow-step">

            Vector Search

          </div>

          <FaArrowRight />

          <div className="workflow-step">

            Gemini AI

          </div>

          <FaArrowRight />

          <div className="workflow-step">

            AI Response

          </div>

        </div>

      </section>

      <section className="features">

        <h2 className="section-title">

          Features

        </h2>

        <div className="feature-grid">

          <div className="feature-card">

            📄 Upload Medical Research Papers

          </div>

          <div className="feature-card">

            🤖 AI Powered Question Answering

          </div>

          <div className="feature-card">

            🔍 Semantic Search

          </div>

          <div className="feature-card">

            📚 Citation & References

          </div>

          <div className="feature-card">

            ⚡ FastAPI Backend

          </div>

          <div className="feature-card">

            🧠 Retrieval Augmented Generation

          </div>

        </div>

      </section>

    </div>

  );

}

export default About;