import TypingMessage from "./TypingMessage";
import ReactMarkdown from "react-markdown";
import {
  FaRobot,
  FaCopy,
  FaRedo,
} from "react-icons/fa";

function ChatMessages({
  chatMessages,
  loading,
  copyMessage,
  regenerateAnswer,
  chatEndRef,
}) {

  return (

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

            {msg.role === "bot" ? (
              <TypingMessage
                text={msg.text}
              />
            ) : (
              <ReactMarkdown>
                {msg.text}
              </ReactMarkdown>
            )}

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
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
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
                    gap: "10px",
                  }}
                >

                  <button
                    className="icon-btn"
                    onClick={() =>
                      copyMessage(msg.text)
                    }
                  >
                    <FaCopy />
                  </button>

                  {msg.question && (
                    <button
                      className="icon-btn"
                      onClick={() =>
                        regenerateAnswer(
                          msg.question
                        )
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

  );

}

export default ChatMessages;