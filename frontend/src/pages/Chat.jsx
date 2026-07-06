import { useState } from "react";
import "../styles/Chat.css";

function Chat() {
  const [message, setMessage] = useState("");

  return (
    <div className="chat-container">

      <div className="chat-header">
        <h1>AI Research Assistant</h1>

        <p>
          Ask questions about your uploaded medical research papers.
        </p>
      </div>

      <div className="chat-box">

        <div className="bot-message">
          👋 Welcome! I'm your Medical Research Assistant.
          Upload research papers and ask questions to get AI-powered answers.
        </div>

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button>Send</button>

      </div>

    </div>
  );
}

export default Chat;