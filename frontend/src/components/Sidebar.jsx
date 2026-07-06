import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">🩺</div>

        <div>
          <h2>MedAI</h2>
          <p>Medical Research Assistant</p>
        </div>
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/home" className="sidebar-link">
          🏠 <span>Dashboard</span>
        </NavLink>

        <NavLink to="/upload" className="sidebar-link">
          📄 <span>Upload Papers</span>
        </NavLink>

        <NavLink to="/search" className="sidebar-link">
          🔍 <span>Search Papers</span>
        </NavLink>

        <NavLink to="/chat" className="sidebar-link">
          💬 <span>AI Assistant</span>
        </NavLink>

        <NavLink to="/about" className="sidebar-link">
          ℹ️ <span>About</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/" className="logout-btn">
          🚪 Logout
        </NavLink>
      </div>

    </div>
  );
}

export default Sidebar;