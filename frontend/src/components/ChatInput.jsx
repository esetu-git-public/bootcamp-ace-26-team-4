import {
  FaPaperPlane,
  FaPaperclip,
} from "react-icons/fa";

function ChatInput({
  message,
  setMessage,
  handleSend,
  handleKeyDown,
  loading,
  uploading,
  textareaRef,
  fileInputRef,
}) {
  return (
    <div className="bottom-bar">

      <button
        className="clip-btn"
        onClick={() =>
          fileInputRef.current.click()
        }
      >
        <FaPaperclip />
      </button>

      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        placeholder="Ask anything about the uploaded paper..."
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={handleKeyDown}
      />

      <button
        className="send-btn"
        disabled={loading || uploading}
        onClick={handleSend}
      >
        <FaPaperPlane />
      </button>

    </div>
  );
}

export default ChatInput;