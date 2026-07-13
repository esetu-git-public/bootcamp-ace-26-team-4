import { FaRobot } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import "./FloatingButton.css";

function FloatingButton() {

  const navigate = useNavigate();
  const location = useLocation();

  // Don't show floating button on Chat page
  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <button
      className="floating-ai"
      onClick={() => navigate("/chat")}
    >
      <FaRobot />
    </button>
  );

}

export default FloatingButton;