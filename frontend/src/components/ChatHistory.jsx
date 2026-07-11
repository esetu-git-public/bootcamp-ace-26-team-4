import "./ChatHistory.css";
import { FaHistory } from "react-icons/fa";

function ChatHistory({
  history,
  onSelect,
}) {

  if (!history.length) {

    return (
      <div className="history-box">

        <h3>

          <FaHistory />

          Chat History

        </h3>

        <p className="history-empty">

          No previous conversations.

        </p>

      </div>
    );

  }

  return (

    <div className="history-box">

      <h3>

        <FaHistory />

        Chat History

      </h3>

      <div className="history-list">

        {history.map((chat, index) => (

          <div
            key={index}
            className="history-item"
            onClick={() => onSelect(chat)}
          >

            <h4>

              {chat.title}

            </h4>

            <span>

              {chat.time}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

export default ChatHistory;