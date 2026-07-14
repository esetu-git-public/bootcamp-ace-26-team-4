import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, FileText, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { api, type UploadedFile } from '../api';

interface FileManagerProps {
  onDocChange: () => void;
  activeDoc: string | null;
}

export const FileManager: React.FC<FileManagerProps> = ({ onDocChange, activeDoc }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listUploads();
      setFiles(data.files || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load uploaded files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    const allowed = ['.pdf', '.docx', '.txt', '.md', '.csv', '.xml'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setError('Unsupported file type. Please upload PDF, DOCX, TXT, MD, CSV, or XML.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setError(null);

    try {
      await api.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      await fetchFiles();
      onDocChange();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete and un-index "${filename}"?`)) return;

    setError(null);
    try {
      await api.deleteUpload(filename);
      await fetchFiles();
      onDocChange();
    } catch (err: any) {
      setError(err.message || 'Failed to delete file.');
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    // python stat returns seconds, JS expects ms
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div>
          <h1 className="page-title">
            <Layers color="var(--color-primary)" />
            Medical Research Papers
          </h1>
          <p className="page-description">
            Upload, manage, and inspect the academic papers indexed in your vector database collection.
          </p>
        </div>
        <button className="btn-primary" onClick={fetchFiles} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="file-manager-grid">
        {/* Upload Column */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', fontSize: '1.15rem' }}>Upload Paper</h3>
          
          <div 
            className={`upload-zone ${dragActive ? 'dragging' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="file-input-hidden" 
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt,.md,.csv,.xml"
            />
            <Upload size={36} className="upload-zone-icon" />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Drag & Drop files here
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Or click to browse from device. Supports PDF, DOCX, TXT, MD, CSV, XML
            </p>
          </div>

          {uploading && (
            <div className="upload-progress-container">
              <div className="upload-progress-label">
                <span>Ingesting text & generating embeddings...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* List Column */}
        <div className="glass-card file-list-card" style={{ padding: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Indexed Collection ({files.length})</h3>
            {activeDoc && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.08)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                Active: {activeDoc}
              </span>
            )}
          </div>

          <div className="file-table-wrapper">
            {files.length === 0 ? (
              <div className="no-files-placeholder">
                <FileText size={48} className="placeholder-icon" />
                <p>No documents uploaded yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Upload a scientific paper on the left to begin RAG vector queries.</p>
              </div>
            ) : (
              <table className="file-table">
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Size</th>
                    <th>Ingestion Date</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => {
                    const isActive = activeDoc === file.filename;
                    return (
                      <tr key={file.filename} style={isActive ? { background: 'rgba(0, 242, 254, 0.02)' } : undefined}>
                        <td>
                          <div className="file-row-name">
                            <FileText size={18} className={file.filename.endsWith('.pdf') ? 'file-icon-pdf' : 'file-icon-doc'} />
                            <span style={isActive ? { color: 'var(--color-primary)', fontWeight: 600 } : undefined}>
                              {file.filename}
                            </span>
                            {isActive && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                                active
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{formatBytes(file.size)}</td>
                        <td>{formatDate(file.last_modified)}</td>
                        <td style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button 
                            className="action-btn delete" 
                            title="Delete file and clear vector store chunks"
                            onClick={() => handleDelete(file.filename)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
