import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaPaperPlane,
  FaPaperclip,
  FaRobot,
  FaFileMedical,
  FaTrash,
} from "react-icons/fa";

import "../styles/Chat.css";
import { askLLM, uploadDocument } from "../services/api";

function Chat() {
  const [message, setMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text:
        "👋 Welcome to **Medical Research AI Assistant**.\n\nUpload a research paper and ask me anything about it.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [currentDocument, setCurrentDocument] = useState(null);

  const fileInputRef = useRef();

  const chatEndRef = useRef();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  const suggestedQuestions = [
    "Summarize this paper",
    "What is the objective?",
    "Explain methodology",
    "List key findings",
    "What are the limitations?",
    "Give conclusion",
  ];
    const handleSuggestion = (text) => {
    setMessage(text);
  };

  const handleSend = async () => {
    if (!message.trim() || loading || uploading) return;

    const question = message;

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
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
    }

    finally {
      setLoading(false);
    }
  };
const uploadFile = async (file) => {

    if (!file) return;

    try {

      setUploading(true);

      setCurrentDocument(file.name);

      setChatMessages((prev)=>[
        ...prev,
        {
          role:"bot",
          text:`📄 Uploading **${file.name}**...`
        }
      ]);

      const result=await uploadDocument(file);

      setChatMessages((prev)=>[
        ...prev,
        {
          role:"bot",
          text:`✅ **${result.filename}** indexed successfully.\n\nAsk me anything about this document.`
        }
      ]);

    }

    catch(error){

      setChatMessages((prev)=>[
        ...prev,
        {
          role:"bot",
          text:error.message
        }
      ]);

    }

    finally{

      setUploading(false);

    }

};
const handleDrop = (e) => {

e.preventDefault();

setDragActive(false);

const file=e.dataTransfer.files[0];

uploadFile(file);

};

const handleDrag=(e)=>{

e.preventDefault();

setDragActive(true);

};

const handleLeave=(e)=>{

e.preventDefault();

setDragActive(false);

};
const handleKeyDown=(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

handleSend();

}

};
return (
  <div className="chat-page">

    {/* Header */}

    <div className="chat-top">

      <div>

        <h1>🩺 Medical Research AI Assistant</h1>

        <p>
          Upload research papers and ask questions using AI.
        </p>

      </div>

      {currentDocument && (

        <div className="current-document">

          <FaFileMedical />

          <div>

            <h4>Current Document</h4>

            <p>{currentDocument}</p>

          </div>

        </div>

      )}

    </div>

    {/* Upload Area */}

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

      <FaPaperclip className="upload-icon"/>

      <h3>Drag & Drop Research Paper</h3>

      <p>

        PDF, DOCX, TXT, CSV, XML

      </p>

      <button

        onClick={()=>

          fileInputRef.current.click()

        }

      >

        Browse File

      </button>

      <input

        ref={fileInputRef}

        hidden

        type="file"

        accept=".pdf,.docx,.txt,.csv,.xml,.md"

        onChange={(e)=>uploadFile(e.target.files[0])}

      />

    </div>

    {/* Suggested Questions */}

    <div className="suggestions">

      {

        suggestedQuestions.map((item,index)=>(

          <button

            key={index}

            onClick={()=>handleSuggestion(item)}

          >

            {item}

          </button>

        ))

      }

    </div>

    {/* Chat Area */}

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

              <FaRobot className="bot-icon"/>

            }

            <div className="bubble">

              <ReactMarkdown>

                {msg.text}

              </ReactMarkdown>

              {

                msg.references && (

                  <details>

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

                  <small>

                    Confidence :

                    {

                      msg.metadata

                      .retrieval_confidence_level

                    }

                  </small>

                )

              }

            </div>

          </div>

        ))

      }

      {

        loading && (

          <div className="message bot">

            <FaRobot className="bot-icon"/>

            <div className="bubble">

              Thinking...

            </div>

          </div>

        )

      }

      <div ref={chatEndRef}></div>

    </div>

    {/* Bottom Input */}

    <div className="bottom-bar">

      <button

        className="clip-btn"

        onClick={()=>

          fileInputRef.current.click()

        }

      >

        <FaPaperclip/>

      </button>

      <textarea

        rows={1}

        placeholder="Ask anything about the uploaded paper..."

        value={message}

        onChange={(e)=>

          setMessage(e.target.value)

        }

        onKeyDown={handleKeyDown}

      />

      <button

        className="send-btn"

        onClick={handleSend}

      >

        <FaPaperPlane/>

      </button>

    </div>

  </div>

);

}

export default Chat;