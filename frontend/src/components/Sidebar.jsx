import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaComments,
  FaInfoCircle,
  FaSignOutAlt,
  FaStethoscope,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">
          <FaStethoscope />
        </div>

        <div>
          <h2>MedAI</h2>
          <p>Medical Research Assistant</p>
        </div>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaComments />
          <span>AI Assistant</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaSearch />
          <span>Search Papers</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaInfoCircle />
          <span>About</span>
        </NavLink>

      </nav>

      <div className="sidebar-spacer"></div>

      <div className="sidebar-bottom">

        <NavLink
          to="/"
          className="logout-btn"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;