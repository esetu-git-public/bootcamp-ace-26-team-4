import {
  FaRobot,
  FaFileMedical,
  FaComments,
  FaDatabase,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import StatsCard from "../components/StatsCard";
import StatusCard from "../components/StatusCard";
import ActivityCard from "../components/ActivityCard";

import "../styles/Home.css";

function Home() {

  return (

    <div className="home-page">

      <div className="hero-card">

        <div>

          <span className="hero-badge">
            🚀 AI Powered
          </span>

          <h1>

            Medical Research Paper Assistant

          </h1>

          <p>

            Analyze medical research papers using
            RAG + Gemini AI.

          </p>

          <Link
            className="primary-btn"
            to="/chat"
          >

            Open AI Assistant

          </Link>

        </div>

        <FaRobot className="hero-icon"/>

      </div>

      <div className="stats-grid">

        <StatsCard
          icon={<FaFileMedical/>}
          title="Documents"
          value="1"
          subtitle="Uploaded"
        />

        <StatsCard
          icon={<FaComments/>}
          title="Questions"
          value="12"
          subtitle="This Session"
        />

        <StatsCard
          icon={<FaRobot/>}
          title="AI Model"
          value="Gemini"
          subtitle="Connected"
        />

        <StatsCard
          icon={<FaDatabase/>}
          title="Vector DB"
          value="Ready"
          subtitle="Indexed"
        />

      </div>

      <div className="dashboard-grid">

        <ActivityCard/>

        <StatusCard/>

      </div>

    </div>

  );

}

export default Home;