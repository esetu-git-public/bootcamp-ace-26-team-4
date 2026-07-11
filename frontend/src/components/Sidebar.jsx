import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaComments,
  FaSearch,
  FaInfoCircle,
  FaSignOutAlt,
  FaStethoscope,
  FaUserCircle,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-circle">

          <FaStethoscope />

        </div>

        <div>

          <h2>MedAI</h2>

          <span>Research Assistant</span>

        </div>

      </div>

      {/* Navigation */}

      <nav className="sidebar-nav">

        <NavLink to="/home">

          <FaHome />

          Dashboard

        </NavLink>

        <NavLink to="/chat">

          <FaComments />

          AI Assistant

        </NavLink>

        <NavLink to="/search">

          <FaSearch />

          Documents

        </NavLink>

        <NavLink to="/about">

          <FaInfoCircle />

          About

        </NavLink>

      </nav>

      {/* Bottom */}

      <div className="sidebar-bottom">

        <div className="profile-card">

          <FaUserCircle />

          <div>

            <h4>Research User</h4>

            <span>Online</span>

          </div>

        </div>

        <NavLink className="logout" to="/">

          <FaSignOutAlt />

          Logout

        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;