import { useState } from "react";
import ReactMarkdown from "react-markdown";

import "../styles/Chat.css";
import { askLLM, uploadDocument } from "../services/api";

function Chat() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm your Medical Research Assistant.\nUpload research papers and ask questions to get AI-powered answers.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  const handleSend = async () => {
    if (!message.trim() || loading || uploading) return;

    const userQuestion = message.trim();
    setMessage("");

    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);

    try {
      setLoading(true);

      const result = await askLLM(userQuestion);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: result.answer || "No answer generated.",
          references: result.formatted_references || "",
          metadata: result.metadata || null,
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || uploading) return;

    try {
      setUploading(true);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Uploading and indexing **${file.name}**...`,
        },
      ]);

      const result = await uploadDocument(file);

      setCurrentDocument(result.current_document);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `✅ File uploaded and indexed successfully.\n\n**Filename:** ${result.filename}\n**Chunks added:** ${result.ingestion?.chunks_added ?? "N/A"}\n\nYou can now ask questions about this document.`,
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Upload error: ${error.message}`,
        },
      ]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
    <div className="chat-header">
      <h1>AI Research Assistant</h1>

      <p>
        Ask questions about your uploaded medical research papers.
      </p>

      {currentDocument && (
        <div className="current-document">
          📄 Current document: <strong>{currentDocument}</strong>
        </div>
      )}

    </div>

      <div className="chat-box">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-message" : "bot-message"}
          >
            <div className="message-text">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>

            {msg.references && (
              <details className="reference-dropdown">
                <summary>📚 References</summary>
                <pre className="chat-references">{msg.references}</pre>
              </details>
            )}

            {msg.metadata && (
              <div className="chat-confidence">
                Confidence: {msg.metadata.retrieval_confidence_level}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bot-message">
            <div className="message-text">Thinking...</div>
          </div>
        )}

        {uploading && (
          <div className="bot-message">
            <div className="message-text">Indexing document...</div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <label className={`upload-button ${uploading ? "disabled" : ""}`}>
          {uploading ? "..." : "📎"}
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,.csv,.xml"
            onChange={handleFileUpload}
            hidden
            disabled={uploading}
          />
        </label>

        <input
          type="text"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || uploading}
        />

        <button onClick={handleSend} disabled={loading || uploading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;