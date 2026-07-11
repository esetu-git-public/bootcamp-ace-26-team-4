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

}) {

  const recognitionRef = useRef(null);

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.onresult = (event) => {

      const text =
        event.results[0][0].transcript;

      setMessage(text);

    };

    recognition.onerror = () => {

      alert("Voice recognition failed.");

    };

    recognitionRef.current =
      recognition;

  }, [setMessage]);

  const startListening = () => {

    if (recognitionRef.current) {
      alert("🎤 Listening... Speak now.");
      recognitionRef.current.start();

    }

    else {

      alert(
        "Speech Recognition not supported in this browser."
      );

    }

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      handleSend();

    }

  };

  return (

    <div className="bottom-bar">

      <button

        className="clip-btn"

        onClick={() =>
          fileInputRef.current.click()
        }

      >

        <FaPaperclip />

      </button>

      <button

        className="voice-btn"

        onClick={startListening}

      >

        <FaMicrophone />

      </button>

      <textarea

        ref={textareaRef}

        rows={1}

        value={message}

        placeholder="Ask anything..."

        onChange={(e) =>
          setMessage(e.target.value)
        }

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

  );

}

export default ChatInput;