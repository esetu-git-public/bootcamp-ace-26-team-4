import {
  FaFileMedical,
  FaComments,
  FaRobot,
  FaChartLine,
} from "react-icons/fa";

import "../styles/Analytics.css";

function Analytics() {

  return (

    <div className="analytics-page fade-up">

      <h1>Analytics Dashboard</h1>

      <div className="analytics-grid">

        <div className="analytics-card">
          <FaFileMedical />
          <h2>24</h2>
          <p>Research Papers</p>
        </div>

        <div className="analytics-card">
          <FaComments />
          <h2>138</h2>
          <p>Questions Asked</p>
        </div>

        <div className="analytics-card">
          <FaRobot />
          <h2>97%</h2>
          <p>AI Accuracy</p>
        </div>

        <div className="analytics-card">
          <FaChartLine />
          <h2>98%</h2>
          <p>System Uptime</p>
        </div>

      </div>

    </div>

  );

}

export default Analytics;