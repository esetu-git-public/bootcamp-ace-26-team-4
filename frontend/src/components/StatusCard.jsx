import {
  FaCheckCircle,
  FaDatabase,
  FaRobot,
  FaServer,
} from "react-icons/fa";

function StatusCard() {
  return (
    <div className="status-card">

      <h2>System Status</h2>

      <div className="status-item">

        <div className="status-left">
          <FaRobot />
          <span>Gemini AI</span>
        </div>

        <span className="status-online">
          Connected
        </span>

      </div>

      <div className="status-item">

        <div className="status-left">
          <FaDatabase />
          <span>Vector Database</span>
        </div>

        <span className="status-online">
          Ready
        </span>

      </div>

      <div className="status-item">

        <div className="status-left">
          <FaServer />
          <span>Backend API</span>
        </div>

        <span className="status-online">
          Online
        </span>

      </div>

      <div className="status-item">

        <div className="status-left">
          <FaCheckCircle />
          <span>System Health</span>
        </div>

        <span className="status-online">
          Excellent
        </span>

      </div>

    </div>
  );
}

export default StatusCard;