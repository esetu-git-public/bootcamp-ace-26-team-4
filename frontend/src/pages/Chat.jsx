import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaPaperPlane,
  FaPaperclip,
  FaRobot,
  FaFileMedical,
  FaTrash,
  FaCopy,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Chat.css";
import { askLLM, uploadDocument } from "../services/api";

function Chat() {
  const [message, setMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text:
        "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a medical research paper and ask me anything.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [currentDocument, setCurrentDocument] = useState(null);

  const fileInputRef = useRef(null);

  const chatEndRef = useRef(null);

  const suggestions = [
    "Summarize this paper",
    "Explain methodology",
    "What are the key findings?",
    "Give conclusion",
    "What are the limitations?",
    "Explain in simple language",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setChatMessages([
      {
        role: "bot",
        text:
          "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a medical research paper and ask me anything.",
      },
    ]);
  };

  const uploadFile = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      setCurrentDocument(file.name);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `📄 Uploading **${file.name}**...`,
        },
      ]);

      const result = await uploadDocument(file);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `✅ **${result.filename}** indexed successfully.\n\nNow ask me anything about this paper.`,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: err.message,
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    if (loading || uploading) return;

    const question = message;

    setMessage("");

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    try {
      setLoading(true);

      const result = await askLLM(question);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: result.answer,
          references: result.formatted_references,
          metadata: result.metadata,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: err.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    setMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    uploadFile(e.dataTransfer.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
return (
  <div className="chat-page">

    {/* Header */}

    <div className="chat-header">

      <div>

        <h1>🩺 Medical Research AI Assistant</h1>

        <p>
          Upload medical research papers and chat with AI.
        </p>

      </div>

      <button
        className="clear-btn"
        onClick={clearChat}
      >
        <FaTrash />
        Clear Chat
      </button>

    </div>

    {/* Current Document */}

    {currentDocument ? (

      <div className="document-card">

        <div className="document-left">

          <FaFileMedical className="document-icon"/>

          <div>

            <h3>{currentDocument}</h3>

            <p>

              <FaCheckCircle />

              Indexed Successfully

            </p>

          </div>

        </div>

        <button
          className="change-file"
          onClick={() => fileInputRef.current.click()}
        >
          Change File
        </button>

      </div>

    ) : (

      <div
        className={
          dragActive
            ? "upload-card active"
            : "upload-card"
        }

        onDrop={handleDrop}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleLeave}
      >

        <FaPaperclip className="upload-icon"/>

        <h2>

          Drag & Drop Research Paper

        </h2>

        <p>

          PDF • DOCX • TXT • XML • CSV

        </p>

        <button

          className="browse-btn"

          onClick={() => fileInputRef.current.click()}

        >

          Browse File

        </button>

      </div>

    )}

    <input

      ref={fileInputRef}

      hidden

      type="file"

      accept=".pdf,.docx,.txt,.csv,.xml,.md"

      onChange={(e)=>uploadFile(e.target.files[0])}

    />

    {/* Suggestions */}

    <div className="suggestions">

      {

        suggestions.map((item,index)=>(

          <button

            key={index}

            onClick={()=>handleSuggestion(item)}

          >

            {item}

          </button>

        ))

      }

    </div>

    {/* Messages */}

    <div className="messages">

      {

        chatMessages.map((msg,index)=>(

          <div

            key={index}

            className={

              msg.role==="user"

              ?

              "message user"

              :

              "message bot"

            }

          >

            {

              msg.role==="bot"

              &&

              <FaRobot className="bot-avatar"/>

            }

            <div className="bubble">

              <ReactMarkdown>

                {msg.text}

              </ReactMarkdown>

              {

                msg.references && (

                  <details className="reference-box">

                    <summary>

                      📚 References

                    </summary>

                    <pre>

                      {msg.references}

                    </pre>

                  </details>

                )

              }

              {

                msg.metadata && (

                  <div className="confidence">

                    Confidence :

                    {

                      msg.metadata.retrieval_confidence_level

                    }

                  </div>

                )

              }

              {

                msg.role==="bot"

                &&

                <button

                  className="copy-btn"

                  onClick={()=>copyText(msg.text)}

                >

                  <FaCopy/>

                  Copy

                </button>

              }

            </div>

          </div>

        ))

      }

      {

        loading && (

          <div className="message bot">

            <FaRobot className="bot-avatar"/>

            <div className="bubble typing">

              <span></span>

              <span></span>

              <span></span>

            </div>

          </div>

        )

      }

      <div ref={chatEndRef}></div>

    </div>

    {/* Bottom */}

    <div className="chat-input">

      <button

        className="attach-btn"

        onClick={()=>fileInputRef.current.click()}

      >

        <FaPaperclip/>

      </button>

      <textarea

        placeholder="Ask anything about the uploaded research paper..."

        value={message}

        rows={1}

        onChange={(e)=>setMessage(e.target.value)}

        onKeyDown={handleKeyDown}

      />

      <button

        className="send-btn"

        onClick={handleSend}

        disabled={loading}

      >

        <FaPaperPlane/>

      </button>

    </div>

  </div>

);

}

export default Chat;