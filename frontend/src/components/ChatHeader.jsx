import {
  FaFileMedical,
  FaDownload,
  FaTrash,
} from "react-icons/fa";

function ChatHeader({
  currentDocument,
  clearChat,
  exportChat,
}) {
  return (
    <div className="chat-header">

      <div className="header-left">

        <div>
          <h1>Medical Research AI Assistant</h1>

          <p>
            Ask questions over uploaded research papers using
            Retrieval-Augmented Generation (RAG).
          </p>
        </div>

      </div>

      <div className="header-right">

        {currentDocument && (
          <div className="document-chip">
            <FaFileMedical />
            <span>{currentDocument}</span>
          </div>
        )}

        <button
          className="header-icon export"
          onClick={exportChat}
          title="Export Chat"
        >
          <FaDownload />
        </button>

        <button
          className="header-icon delete"
          onClick={clearChat}
          title="Clear Chat"
        >
          <FaTrash />
        </button>

      </div>

    </div>
  );
}

export default ChatHeader;