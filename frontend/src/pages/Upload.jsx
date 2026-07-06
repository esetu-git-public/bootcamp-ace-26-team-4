import { useState } from "react";
import "../styles/Upload.css";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="upload-container">

      <div className="upload-header">
        <h1>Upload Research Papers</h1>

        <p>
          Upload medical research papers in PDF format for AI-powered
          search and question answering.
        </p>
      </div>

      <div className="upload-card">

        <div className="upload-icon">📄</div>

        <h2>Select a Research Paper</h2>

        <p>Supported Format: PDF</p>

        <input
          type="file"
          accept=".pdf"
          id="fileInput"
          hidden
          onChange={handleFileChange}
        />

        <label htmlFor="fileInput" className="choose-btn">
          Choose PDF
        </label>

        {selectedFile && (
          <div className="selected-file">
            <strong>Selected File:</strong>
            <br />
            {selectedFile.name}
          </div>
        )}

        <button className="upload-btn">
          Upload Paper
        </button>

      </div>

      <div className="guidelines">

        <h2>Upload Guidelines</h2>

        <ul>
          <li>Upload only medical research papers.</li>
          <li>Accepted format: PDF (.pdf)</li>
          <li>Maximum file size: 20 MB</li>
          <li>Uploaded papers will be available for Search and AI Chat.</li>
        </ul>

      </div>

    </div>
  );
}

export default Upload;