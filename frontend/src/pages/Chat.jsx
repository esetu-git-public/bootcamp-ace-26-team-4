import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

import {
  FaPaperPlane,
  FaPaperclip,
  FaRobot,
  FaFileMedical,
  FaTrash,
  FaCopy,
  FaRedo,
} from "react-icons/fa";

import "../styles/Chat.css";
import { askLLM, uploadDocument } from "../services/api";

function Chat() {

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [currentDocument, setCurrentDocument] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text:
        "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a medical research paper and ask me anything about it.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const fileInputRef = useRef(null);

  const textareaRef = useRef(null);

  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "Summarize this paper",
    "Explain methodology",
    "Key findings",
    "Limitations",
    "Future work",
    "Conclusion",
  ];

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chatMessages]);

  useEffect(() => {

    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";

    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";

  }, [message]);

  const handleSuggestion = (question) => {

    setMessage(question);

    textareaRef.current?.focus();

  };

  const clearChat = () => {

    toast.info("Chat cleared");

    setChatMessages([
      {
        role: "bot",
        text:
          "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a medical research paper and ask me anything about it.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

  };

  const copyMessage = (text) => {

    navigator.clipboard.writeText(text);

    toast.success("Copied to clipboard");

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      handleSend();

    }

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
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      const result = await uploadDocument(file);

      toast.success("Research paper uploaded successfully.");

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `✅ **${result.filename}** uploaded successfully.\n\nNow ask me anything about this paper.`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } catch (error) {

      toast.error("Upload failed.");

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: error.message || "Upload failed.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } finally {

      setUploading(false);

    }

  };

  const handleSend = async () => {

    if (!message.trim()) return;

    if (loading || uploading) return;

    const question = message.trim();

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");

    try {

      setLoading(true);

      const result = await askLLM(question);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: result.answer || "No answer generated.",
          references: result.formatted_references,
          metadata: result.metadata,
          question,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } catch (error) {

      toast.error("Unable to generate response.");

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: error.message || "Something went wrong.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } finally {

      setLoading(false);

    }

  };

  const regenerateAnswer = async (question) => {

    if (!question) return;

    try {

      setLoading(true);

      const result = await askLLM(question);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: result.answer || "No answer generated.",
          references: result.formatted_references,
          metadata: result.metadata,
          question,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } catch (error) {

      toast.error("Unable to regenerate answer.");

    } finally {

      setLoading(false);

    }

  };

  const handleDrop = (e) => {

    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files[0];

    uploadFile(file);

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

      <div className="chat-top">

        <div>

          <h1>🩺 Medical Research AI Assistant</h1>

          <p>
            Upload a research paper and ask questions using AI.
          </p>

        </div>

        <div style={{ display: "flex", gap: "12px" }}>

          {currentDocument && (

            <div className="current-document">

              <FaFileMedical />

              <div>

                <h4>Current Document</h4>

                <p>{currentDocument}</p>

              </div>

            </div>

          )}

          <button
            className="clear-btn"
            onClick={clearChat}
          >
            <FaTrash />
          </button>

        </div>

      </div>

      {/* Upload */}

      {!currentDocument && (

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

          <p>
            PDF, DOCX, TXT, CSV, XML
          </p>

          <button
            onClick={() => fileInputRef.current.click()}
          >
            Browse File
          </button>

          <input
            hidden
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.csv,.xml,.md"
            onChange={(e) => uploadFile(e.target.files[0])}
          />

        </div>

      )}

      {/* Suggestions */}

      <div className="suggestions">

        {suggestedQuestions.map((item, index) => (

          <button
            key={index}
            onClick={() => handleSuggestion(item)}
          >
            {item}
          </button>

        ))}

      </div>

      {/* Messages */}

      <div className="messages">

        {chatMessages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.role === "user"
                ? "message user"
                : "message bot"
            }
          >

            {msg.role === "bot" && (
              <FaRobot className="bot-icon" />
            )}

            <div className="bubble">

              <ReactMarkdown>

                {msg.text}

              </ReactMarkdown>

              {msg.references && (

                <details>

                  <summary>

                    📚 References

                  </summary>

                  <pre>

                    {msg.references}

                  </pre>

                </details>

              )}

              {msg.metadata && (

                <small>

                  Confidence :
                  {" "}
                  {
                    msg.metadata
                      .retrieval_confidence_level
                  }

                </small>

              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                }}
              >

                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {msg.time}
                </span>

                {msg.role === "bot" && (

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >

                    <button
                      className="icon-btn"
                      onClick={() => copyMessage(msg.text)}
                    >
                      <FaCopy />
                    </button>

                    {msg.question && (

                      <button
                        className="icon-btn"
                        onClick={() =>
                          regenerateAnswer(msg.question)
                        }
                      >
                        <FaRedo />
                      </button>

                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        ))}

        {loading && (

          <div className="message bot">

            <FaRobot className="bot-icon" />

            <div className="bubble">

              <div className="typing">

                <span></span>

                <span></span>

                <span></span>

              </div>

            </div>

          </div>

        )}

        <div ref={chatEndRef}></div>

      </div>

      {/* Bottom Input */}

      <div className="bottom-bar">

        <button
          className="clip-btn"
          onClick={() => fileInputRef.current.click()}
        >

          <FaPaperclip />

        </button>

        <textarea

          ref={textareaRef}

          rows={1}

          placeholder="Ask anything about the uploaded paper..."

          value={message}

          onChange={(e) => setMessage(e.target.value)}

          onKeyDown={handleKeyDown}

        />

        <button

          className="send-btn"

          disabled={loading || uploading}

          onClick={handleSend}

        >

          <FaPaperPlane />

        </button>

      </div>

    </div>
  );

}

export default Chat;