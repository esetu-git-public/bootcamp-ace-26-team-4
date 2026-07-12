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

    }

    else {

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

      <button

        className="input-icon"

        onClick={() =>
          fileInputRef.current.click()
        }

      >

        <FaPaperclip />

      </button>

      <textarea

        ref={textareaRef}

        rows={1}

        value={message}

        placeholder="Message Medical Research AI..."

        onChange={(e)=>
          setMessage(e.target.value)
        }

        onKeyDown={handleKeyDown}

      />

      <button

        className="input-icon voice"

        onClick={startListening}

      >

        <FaMicrophone />

      </button>

      <button

        className="send-button"

        disabled={loading || uploading}

        onClick={handleSend}

      >

        <FaPaperPlane />

      </button>

    </div>

  );

}

export default ChatInput;