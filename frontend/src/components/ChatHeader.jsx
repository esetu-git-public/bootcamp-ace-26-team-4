import {
  FaFileMedical,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

function ChatHeader({
  currentDocument,
  clearChat,
  exportChat,
}) {
  return (
    <div className="chat-top">
      <div>
        <h1>🩺 Medical Research AI Assistant</h1>

        <p>
          Upload research papers and ask questions using AI.
        </p>
      </div>

      <div className="header-actions">

        {currentDocument && (
          <div className="current-document">

            <FaFileMedical />

            <div>

              <h4>Current Document</h4>

              <p>{currentDocument}</p>

            </div>

          </div>
        )}

        <button
          className="icon-action-btn"
          onClick={exportChat}
        >
          <FaDownload />
        </button>

        <button
          className="clear-btn"
          onClick={clearChat}
        >
          <FaTrash />
        </button>

      </div>

    </div>
  );
}

export default ChatHeader;