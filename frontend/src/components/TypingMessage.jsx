import { useEffect, useState } from "react";

function TypingMessage({ text }) {

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {

    let index = 0;

    const timer = setInterval(() => {

      setDisplayText(text.slice(0, index));

      index++;

      if (index > text.length) {

        clearInterval(timer);

      }

    }, 15);

    return () => clearInterval(timer);

  }, [text]);

  return displayText;

}

export default TypingMessage;