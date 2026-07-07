import { useState } from "react";
import "../styles/Upload.css";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Allow only PDF
    if (file.type !== "application/pdf") {
      setMessage("❌ Please upload only PDF files.");
      setSelectedFile(null);
      return;
    }

    // Max Size 20MB
    if (file.size > 20 * 1024 * 1024) {
      setMessage("❌ File size must be less than 20 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const removeFile = () => {
    setSelectedFile(null);
    setMessage("");
    document.getElementById("fileInput").value = "";
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setMessage("⚠ Please select a PDF file.");
      return;
    }

    // Backend will be connected later
    setMessage("✅ Research paper is ready for backend upload.");
  };

  return (
    <div className="upload-container">

      {/* Header */}

      <div className="upload-header">
        <h1>Upload Medical Research Paper</h1>

        <p>
          Upload research papers in PDF format to make them searchable
          through the AI-powered Medical Research Assistant.
        </p>
      </div>

      {/* Upload Card */}

      <div className="upload-card">

        <div className="drop-zone">

          <div className="upload-icon">
            📄
          </div>

          <h2>Drag & Drop your PDF here</h2>

          <p className="upload-subtitle">
            or click below to browse your files
          </p>

          <input
            type="file"
            accept=".pdf"
            id="fileInput"
            hidden
            onChange={handleFileChange}
          />

          <label htmlFor="fileInput" className="choose-btn">
            Browse Files
          </label>

        </div>

        {selectedFile && (

          <div className="selected-file">

            <h3>Selected File</h3>

            <p>
              <strong>Name :</strong> {selectedFile.name}
            </p>

            <p>
              <strong>Size :</strong>{" "}
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>

            <p className="status ready">
              Status : Ready to Upload
            </p>

            <button
              className="remove-btn"
              onClick={removeFile}
            >
              Remove File
            </button>

          </div>

        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload Paper
        </button>

        {message && (
          <p className="upload-message">
            {message}
          </p>
        )}

      </div>

      {/* Guidelines */}

      <div className="guidelines">

        <h2>Upload Guidelines</h2>

        <ul>
          <li>📄 Upload only medical research papers.</li>
          <li>✅ PDF format (.pdf) only.</li>
          <li>📦 Maximum file size: 20 MB.</li>
          <li>🤖 Uploaded papers will be indexed for AI Search & Chat.</li>
          <li>🔒 Your uploaded documents remain private and secure.</li>
        </ul>

      </div>

    </div>
  );
}

export default Upload;