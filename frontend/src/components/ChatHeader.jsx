import {
  FaFileMedical,
  FaTrash,
  FaDownload,
  FaCircle,
} from "react-icons/fa";

function ChatHeader({
  currentDocument,
  clearChat,
  exportChat,
}) {

  return (

    <header className="chat-header">

      <div className="header-left">

        <div className="assistant-logo">

          🩺

        </div>

        <div>

          <h1>

            Medical Research AI Assistant

          </h1>

          <div className="assistant-status">

            <FaCircle />

            <span>

              AI Online

            </span>

          </div>

        </div>

      </div>

      <div className="header-right">

        {currentDocument && (

          <div className="document-chip">

            <FaFileMedical />

            <span>

              {currentDocument}

            </span>

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

    </header>

  );

}

export default ChatHeader;