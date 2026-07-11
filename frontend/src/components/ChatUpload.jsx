import { FaPaperclip } from "react-icons/fa";

function ChatUpload({
  dragActive,
  handleDrop,
  handleDrag,
  handleLeave,
  fileInputRef,
  uploadFile,
}) {
  return (
    <div
      className={
        dragActive
          ? "upload-box active"
          : "upload-box"
      }
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleLeave}
    >
      <FaPaperclip className="upload-icon" />

      <h3>Drag & Drop Research Paper</h3>

      <p>PDF, DOCX, TXT, CSV, XML</p>

      <button
        onClick={() =>
          fileInputRef.current.click()
        }
      >
        Browse File
      </button>

      <input
        hidden
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.csv,.xml,.md"
        onChange={(e) =>
          uploadFile(e.target.files[0])
        }
      />
    </div>
  );
}

export default ChatUpload;