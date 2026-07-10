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

export default EmptyState;