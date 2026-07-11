import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaSearch,
  FaComments,
  FaInfoCircle,
  FaSignOutAlt,
  FaStethoscope,
  FaChevronLeft,
} from "react-icons/fa";

import { useState } from "react";

import "./Sidebar.css";

function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  return (

    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-icon">

          <FaStethoscope />

        </div>

        {!collapsed && (

          <div>

            <h2>MedAI</h2>

            <p>Research Assistant</p>

          </div>

        )}

      </div>

      {/* Collapse */}

      <button

        className="collapse-btn"

        onClick={() => setCollapsed(!collapsed)}

      >

        <FaChevronLeft
          className={collapsed ? "rotate" : ""}
        />

      </button>

      {/* Navigation */}

      <nav className="sidebar-nav">

        <NavLink to="/home" className="sidebar-link">

          <FaHome />

          {!collapsed && <span>Dashboard</span>}

        </NavLink>

        <NavLink to="/chat" className="sidebar-link">

          <FaComments />

          {!collapsed && <span>AI Assistant</span>}

        </NavLink>

        <NavLink to="/search" className="sidebar-link">

          <FaSearch />

          {!collapsed && <span>Search</span>}

        </NavLink>

        <NavLink to="/about" className="sidebar-link">

          <FaInfoCircle />

          {!collapsed && <span>About</span>}

        </NavLink>

      </nav>

      <div className="sidebar-spacer"></div>

      <NavLink to="/" className="logout-btn">

        <FaSignOutAlt />

        {!collapsed && <span>Logout</span>}

      </NavLink>

    </aside>

  );

}

export default Sidebar;