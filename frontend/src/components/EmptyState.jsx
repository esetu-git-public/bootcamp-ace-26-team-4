<<<<<<< HEAD
import { FaFileMedical } from "react-icons/fa";

function EmptyState() {
  return (
    <div className="empty-state">

      <FaFileMedical className="empty-icon" />

      <h2>No Documents Found</h2>

      <p>
        Upload medical research papers to start searching and chatting.
      </p>

    </div>
  );
}
=======
import React from "react";
import "../styles/EmptyState.css";

const EmptyState = ({ icon, title, message }) => {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{message}</p>

    </div>
  );
};
>>>>>>> 8f90d63 (Enhance registration page with validation and UX improvements)

export default EmptyState;