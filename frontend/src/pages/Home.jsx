import {
  FaFileMedical,
  FaRobot,
  FaSearch,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* Header */}

      <div className="home-header">

        <div>

          <h1>🩺 Medical Research AI Assistant</h1>

          <p>
            Analyze research papers using AI-powered Retrieval
            Augmented Generation.
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <FaFileMedical className="stat-icon"/>

          <div>

            <h2>Documents</h2>

            <h1>1</h1>

            <span>Uploaded</span>

          </div>

        </div>

        <div className="stat-card">

          <FaComments className="stat-icon"/>

          <div>

            <h2>Questions</h2>

            <h1>24</h1>

            <span>Asked</span>

          </div>

        </div>

        <div className="stat-card">

          <FaRobot className="stat-icon"/>

          <div>

            <h2>AI Status</h2>

            <h1>Ready</h1>

            <span>Online</span>

          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="quick-section">

        <h2>Quick Actions</h2>

        <div className="action-grid">

          <Link to="/chat" className="action-card">

            <FaRobot />

            <h3>AI Assistant</h3>

            <p>
              Upload a paper and ask questions.
            </p>

            <FaArrowRight/>

          </Link>

          <Link to="/search" className="action-card">

            <FaSearch />

            <h3>Search Papers</h3>

            <p>
              Search indexed research papers.
            </p>

            <FaArrowRight/>

          </Link>

        </div>

      </div>

      {/* Recent */}

      <div className="recent-card">

        <h2>Recent Activity</h2>

        <div className="activity">

          <FaFileMedical/>

          <div>

            <h3>No documents uploaded</h3>

            <p>
              Upload your first research paper from AI Assistant.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;