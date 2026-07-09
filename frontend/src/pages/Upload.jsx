import { useState } from "react";
import { uploadDocument } from "../services/api";
import "../styles/Upload.css";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Allow only PDF
    if (file.type !== "application/pdf") {
      setMessage("❌ Please upload only PDF files.");
      setSelectedFile(null);
      return;
    }

    // Max 20 MB
    if (file.size > 20 * 1024 * 1024) {
      setMessage("❌ File size should be less than 20 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setProgress(0);
  };

  const removeFile = () => {
    setSelectedFile(null);

    const input = document.getElementById("fileInput");

    if (input) {
      input.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("⚠ Please choose a PDF first.");
      return;
    }

    try {
      setUploading(true);
      setProgress(20);
      setMessage("");

      const response = await uploadDocument(selectedFile);

      setProgress(100);

      setMessage(`✅ ${response.message}`);

      console.log("Upload Response:", response);

      removeFile();
    } catch (error) {
      console.error(error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">

      <div className="upload-header">
        <h1>Upload Medical Research Paper</h1>

        <p>
          Upload your medical research papers in PDF format.
          These documents will be processed and indexed for
          AI-powered Search and Chat.
        </p>
      </div>

      <div className="upload-card">

        <div className="drop-zone">

          <div className="upload-icon">📄</div>

          <h2>Drag & Drop your PDF here</h2>

          <p className="upload-subtitle">
            or browse files from your computer
          </p>

          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            hidden
            onChange={handleFileChange}
          />

          <label
            htmlFor="fileInput"
            className="choose-btn"
          >
            Browse Files
          </label>

        </div>

        {selectedFile && (

          <div className="selected-file">

            <h3>Selected Document</h3>

            <p>
              <strong>Name:</strong> {selectedFile.name}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>

            <p>
              <strong>Type:</strong> PDF Document
            </p>

            <p>
              <strong>Last Modified:</strong>{" "}
              {new Date(selectedFile.lastModified).toLocaleDateString()}
            </p>

            <span className="status ready">
              Ready to Upload
            </span>

            <button
              className="remove-btn"
              onClick={removeFile}
            >
              Remove File
            </button>

          </div>

        )}

        {uploading && (

          <div className="progress-section">

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>

            </div>

            <p className="progress-text">
              Uploading...
            </p>

          </div>

        )}

        <button
          className="upload-btn"
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload Paper"}
        </button>

        {message && (
          <div className="upload-message">
            {message}
          </div>
        )}

      </div>

      <div className="guidelines">

        <h2>Upload Guidelines</h2>

        <ul>
          <li>📄 Upload only Medical Research Papers.</li>
          <li>📑 Accepted format: PDF (.pdf).</li>
          <li>📦 Maximum upload size: 20 MB.</li>
          <li>🤖 Documents will be processed for AI Search & Chat.</li>
          <li>🔒 Uploaded files remain secure.</li>
        </ul>

      </div>

      <div className="workflow-card">

        <h2>Document Processing Workflow</h2>

        <div className="workflow">

          <div className="workflow-step">
            📄
            <p>Upload PDF</p>
          </div>

          <div className="arrow">→</div>

          <div className="workflow-step">
            📝
            <p>Extract Text</p>
          </div>

          <div className="arrow">→</div>

          <div className="workflow-step">
            ✂️
            <p>Chunk Text</p>
          </div>

          <div className="arrow">→</div>

          <div className="workflow-step">
            🧠
            <p>Create Embeddings</p>
          </div>

          <div className="arrow">→</div>

          <div className="workflow-step">
            💾
            <p>Store in Vector DB</p>
          </div>

          <div className="arrow">→</div>

          <div className="workflow-step">
            🤖
            <p>Ready for AI Chat</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Upload;