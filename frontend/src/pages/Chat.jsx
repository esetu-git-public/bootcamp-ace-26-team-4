import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";

import "../styles/Chat.css";

import {
  askLLM,
  uploadDocument,
  deleteDocument,
} from "../services/api";

import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatHistory from "../components/ChatHistory";

function Chat() {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ChatGPT-style history drawer
  const [showHistory, setShowHistory] = useState(false);

  const [currentDocument, setCurrentDocument] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text:
        "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a medical research paper using the attachment button below and ask me anything.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

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
    localStorage.setItem(
      "chatHistory",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [message]);

  const handleSuggestion = (text) => {
    setMessage(text);
    textareaRef.current?.focus();
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    }
  };

  const handleLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];

    if (file) {
      await uploadFile(file);
    }
  };

  const clearChat = () => {

    toast.info("Chat cleared");

    setChatMessages([
      {
        role: "bot",
        text:
          "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a medical research paper using the attachment button below and ask me anything.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

  };
  const removeDocument = async () => {

  if (!currentDocument) return;

  try {

    await deleteDocument(currentDocument);

    setCurrentDocument(null);

    toast.success("Document deleted successfully.");

  } catch (err) {

    toast.error(err.message);

  }

};

  const exportChat = () => {

    const content = chatMessages
      .map(
        (m) =>
          `${m.role.toUpperCase()}\n${m.text}\n`
      )
      .join("\n-----------------\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "chat.txt";
    a.click();

    URL.revokeObjectURL(url);

  };

  const openHistory = (chat) => {

    setChatMessages(chat.messages);

    // Close history drawer after selecting a chat
    setShowHistory(false);

  };

  const uploadFile = async (file) => {

    if (!file) return;

    try {

      setUploading(true);

      setCurrentDocument(file.name);

      toast.success("Research paper uploaded.");

      await uploadDocument(file);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `✅ **${file.name}** uploaded successfully.`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } catch (err) {

      toast.error(err.message);

    } finally {

      setUploading(false);

    }

  };

  const handleSend = async () => {

    if (!message.trim()) return;

    const question = message;

    const user = {
      role: "user",
      text: question,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, user]);

    setMessage("");

    try {

      setLoading(true);

      const result = await askLLM(question);

      const bot = {
        role: "bot",
        text: result.answer,
        references: result.formatted_references,
        metadata: result.metadata,
        question,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, bot]);

      setChatHistory((prev) => [
        {
          title: question.substring(0, 35),
          time: new Date().toLocaleString(),
          messages: [user, bot],
        },
        ...prev,
      ]);

    } catch {

      toast.error("Unable to generate response.");

    } finally {

      setLoading(false);

    }

  };

  const regenerateAnswer = async (question) => {

    const result = await askLLM(question);

    setChatMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: result.answer,
        references: result.formatted_references,
        metadata: result.metadata,
        question,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

  };

  return (

    <div
      className={`chat-page${dragActive ? " drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleLeave}
      onDrop={handleDrop}
    >

      <ChatHeader
  currentDocument={currentDocument}
  clearChat={clearChat}
  removeDocument={removeDocument}
  exportChat={exportChat}
/>


      {/* ChatGPT-style Recent Chats button */}
      <button
        className="history-toggle"
        onClick={() => setShowHistory(!showHistory)}
      >
        <FaBars />
      </button>

      <div className="chat-layout">

        {showHistory && (
          <aside className="history-panel">
            <ChatHistory
              history={chatHistory}
              onSelect={openHistory}
            />
          </aside>
        )}

        <section className="chat-panel">

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

          <ChatMessages
            chatMessages={chatMessages}
            loading={loading}
            copyMessage={copyMessage}
            regenerateAnswer={regenerateAnswer}
            chatEndRef={chatEndRef}
          />

          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            loading={loading}
            uploading={uploading}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
            uploadFile={uploadFile}
         />

        </section>

      </div>

    </div>

  );

}

export default Chat;