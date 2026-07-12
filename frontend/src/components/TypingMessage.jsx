import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function TypingMessage({ text }) {

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {

    if (!text) return;

    let index = 0;

    const timer = setInterval(() => {

      index++;

      setDisplayText(text.slice(0, index));

      if (index >= text.length) {

        clearInterval(timer);

      }

    }, 10);

    return () => clearInterval(timer);

  }, [text]);

  return (

    <div className="markdown-body">

      <ReactMarkdown>

        {displayText}

      </ReactMarkdown>

    </div>

  );

}

export default TypingMessage;