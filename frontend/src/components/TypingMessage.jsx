import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function TypingMessage({ text }) {

  const [displayText, setDisplayText] =
    useState("");

  useEffect(() => {

    let index = 0;

    setDisplayText("");

    const timer = setInterval(() => {

      index++;

      setDisplayText(
        text.substring(0, index)
      );

      if (index >= text.length) {
        clearInterval(timer);
      }

    }, 15);

    return () => clearInterval(timer);

  }, [text]);

  return (
    <ReactMarkdown>
      {displayText}
    </ReactMarkdown>
  );
}

export default TypingMessage;