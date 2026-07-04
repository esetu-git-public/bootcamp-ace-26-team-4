import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🩺
        <span>Medical Research Paper Assistant</span>
      </div>

      <ul className="nav-links">

        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <NavLink to="/upload">Upload</NavLink>
        </li>

        <li>
          <NavLink to="/search">Search</NavLink>
        </li>

        <li>
          <NavLink to="/chat">Chat</NavLink>
        </li>

        <li>
          <NavLink to="/about">About</NavLink>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;