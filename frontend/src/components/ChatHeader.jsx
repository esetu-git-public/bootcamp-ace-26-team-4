import {
  FaFileMedical,
  FaTrash,
} from "react-icons/fa";

function ChatHeader({
  currentDocument,
  clearChat,
}) {
  return (
    <div className="chat-top">
      <div>
        <h1>🩺 Medical Research AI Assistant</h1>

        <p>
          Upload a research paper and ask
          questions using AI.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
        }}
      >
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