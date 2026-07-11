import {
  FaRobot,
  FaFileMedical,
  FaComments,
  FaSearch,
  FaArrowRight,
  FaChartLine,
  FaBrain,
  FaDatabase,
  FaClock,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/Home.css";

function Home() {

  const activities = [
    "📄 Upload your latest medical research paper.",
    "🤖 Ask AI to summarize the uploaded paper.",
    "📚 View references with confidence score.",
    "🔍 Search indexed research documents.",
  ];

  return (

    <div className="home-page">

      {/* HERO */}

      <div className="hero-card">

        <div>

          <span className="hero-badge">
            🚀 AI Powered Research Assistant
          </span>

          <h1>

            Medical Research Paper Assistant

          </h1>

          <p>

            Analyze, summarize and search medical research papers
            using Retrieval-Augmented Generation (RAG) with
            Gemini AI.

          </p>

          <div className="hero-buttons">

            <Link
              to="/chat"
              className="primary-btn"
            >
              Open AI Assistant
            </Link>

            <Link
              to="/search"
              className="secondary-btn"
            >
              Search Papers
            </Link>

          </div>

        </div>

        <div className="hero-icon">

          <FaRobot />

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">

          <FaFileMedical />

          <h2>Documents</h2>

          <h3>1</h3>

          <p>Uploaded Paper</p>

        </div>

        <div className="stat-card">

          <FaComments />

          <h2>Questions</h2>

          <h3>--</h3>

          <p>Current Session</p>

        </div>

        <div className="stat-card">

          <FaBrain />

          <h2>AI Model</h2>

          <h3>Gemini</h3>

          <p>Connected</p>

        </div>

        <div className="stat-card">

          <FaDatabase />

          <h2>Vector DB</h2>

          <h3>Ready</h3>

          <p>Indexed Successfully</p>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="section-title">

        <h2>Quick Actions</h2>

      </div>

      <div className="action-grid">

        <Link
          to="/chat"
          className="action-card"
        >

          <FaRobot />

          <h3>AI Assistant</h3>

          <p>

            Chat with uploaded medical papers.

          </p>

          <FaArrowRight className="arrow"/>

        </Link>

        <Link
          to="/search"
          className="action-card"
        >

          <FaSearch />

          <h3>Search Papers</h3>

          <p>

            Search indexed medical documents.

          </p>

          <FaArrowRight className="arrow"/>

        </Link>

      </div>

      {/* DASHBOARD */}

      <div className="dashboard-grid">

        <div className="recent-card">

          <h2>

            <FaClock />

            Recent Activity

          </h2>

          <ul>

            {

              activities.map((item,index)=>(

                <li key={index}>

                  {item}

                </li>

              ))

            }

          </ul>

        </div>

        <div className="status-card">

          <h2>

            <FaChartLine />

            AI Status

          </h2>

          <div className="status-row">

            <span>Backend</span>

            <span className="online">

              ● Online

            </span>

          </div>

          <div className="status-row">

            <span>Gemini API</span>

            <span className="online">

              ● Ready

            </span>

          </div>

          <div className="status-row">

            <span>Vector Store</span>

            <span className="online">

              ● Active

            </span>

          </div>

          <div className="status-row">

            <span>Retrieval</span>

            <span className="online">

              ● Working

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Home;