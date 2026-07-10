import {
  FaFilePdf,
  FaEye,
  FaTrash,
  FaRobot,
} from "react-icons/fa";

function DocumentCard({ doc }) {
  return (
    <div className="document-card">

      <div className="document-top">

        <FaFilePdf className="pdf-icon" />

        <div>

          <h3>{doc.name}</h3>

          <p>{doc.date}</p>

        </div>

        <span className="status indexed">
          Indexed
        </span>

      </div>

      <div className="document-info">

        <p>
          Size :
          <strong>
            {doc.size}
          </strong>
        </p>

      </div>

      <div className="document-buttons">

        <button className="view-btn">
          <FaEye />
          View
        </button>

        <button className="chat-btn">
          <FaRobot />
          Ask AI
        </button>

        <button className="delete-btn">
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
}

export default DocumentCard;