import {
  FaCloudUploadAlt,
  FaFilePdf,
} from "react-icons/fa";

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

      <div className="upload-circle">

        <FaCloudUploadAlt />

      </div>

      <h2>

        Upload Medical Research Paper

      </h2>

      <p>

        Drag & Drop your PDF here

      </p>

      <span>

        or

      </span>

      <button

        onClick={() =>
          fileInputRef.current.click()
        }

      >

        Browse Files

      </button>

      <div className="supported-files">

        <FaFilePdf />

        PDF • DOCX • TXT • CSV • XML

      </div>

      <input

        hidden

        ref={fileInputRef}

        type="file"

        accept=".pdf,.docx,.txt,.csv,.xml,.md"

        onChange={(e)=>

          uploadFile(e.target.files[0])

        }

      />

    </div>

  );

}

export default ChatUpload;