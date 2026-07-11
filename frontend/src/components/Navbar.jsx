import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🩺
        <span>Medical Research AI Assistant</span>
      </div>

      <ul className="nav-links">

        <li>
          <NavLink to="/home">Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/chat">AI Assistant</NavLink>
        </li>

        <li>
          <NavLink to="/search">Documents</NavLink>
        </li>

        <li>
          <NavLink to="/about">About</NavLink>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;