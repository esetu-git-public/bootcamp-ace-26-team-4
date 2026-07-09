import { useState } from "react";
import { askLLM } from "../services/api";
import "../styles/Chat.css";

function Chat() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm your Medical Research Assistant. Upload research papers and ask questions to get AI-powered answers.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userQuestion = message;
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
          text: result.answer,
          references: result.formatted_references,
          metadata: result.metadata,
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Research Assistant</h1>

        <p>Ask questions about your uploaded medical research papers.</p>
      </div>

      <div className="chat-box">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-message" : "bot-message"}
          >
            <div>{msg.text}</div>

            {msg.references && (
              <pre className="chat-references">
                {msg.references}
              </pre>
            )}

            {msg.metadata && (
              <small className="chat-confidence">
                Confidence: {msg.metadata.retrieval_confidence_level}
              </small>
            )}
          </div>
        ))}

        {loading && (
          <div className="bot-message">
            Thinking...
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;