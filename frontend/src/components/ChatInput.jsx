import {
  FaPaperPlane,
  FaPaperclip,
  FaMicrophone,
} from "react-icons/fa";

import { useEffect, useRef } from "react";

function ChatInput({

  message,
  setMessage,
  handleSend,
  loading,
  uploading,
  textareaRef,
  fileInputRef,
  uploadFile,

}) {

  const recognitionRef = useRef(null);

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {

      setMessage(
        event.results[0][0].transcript
      );

    };

    recognitionRef.current = recognition;

  }, [setMessage]);

  const startListening = () => {

    if (recognitionRef.current) {

      recognitionRef.current.start();

    } else {

      alert(
        "Speech Recognition is not supported."
      );

    }

  };

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();
      handleSend();

    }

  };

  return (

    <div className="chat-input-container">

      {/* Hidden File Input */}

      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.txt,.csv,.xml"
        style={{ display: "none" }}
        onChange={(e) => {

          const file = e.target.files[0];

          if (file) {

            uploadFile(file);

          }

          e.target.value = "";

        }}
      />

      {/* Attachment Button */}

      <button

        className="input-icon"

        onClick={() =>
          fileInputRef.current?.click()
        }

        type="button"

      >

        <FaPaperclip />

      </button>

      {/* Message Box */}

      <textarea

        ref={textareaRef}

        rows={1}

        value={message}

        placeholder="Message Medical Research AI..."

        onChange={(e) =>
          setMessage(e.target.value)
        }

        onKeyDown={handleKeyDown}

      />

      {/* Voice Button */}

      <button

        className="input-icon voice"

        onClick={startListening}

        type="button"

      >

        <FaMicrophone />

      </button>

      {/* Send Button */}

      <button

        className="send-button"

        disabled={loading || uploading}

        onClick={handleSend}

        type="button"

      >

        <FaPaperPlane />

      </button>

    </div>

  );

}

export default ChatInput;