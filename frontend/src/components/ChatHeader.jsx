import { useState } from "react";
import "./ChatHistory.css";

function ChatHistory({
  history,
  onSelect,
}) {

  const [search, setSearch] = useState("");

  const filteredHistory = history.filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="history-container">

      <h3>💬 Chat History</h3>

      <input
        type="text"
        className="history-search"
        placeholder="Search chats..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {filteredHistory.length === 0 ? (

        <div className="empty-history">

          No chats found

        </div>

      ) : (

        filteredHistory.map((chat, index) => (

          <div
            key={index}
            className="history-card"
            onClick={() => onSelect(chat)}
          >

            <div className="history-title">

              {chat.title}

            </div>

            <div className="history-time">

              {chat.time}

            </div>

          </div>

        ))

      )}

    </div>
  );

}

export default ChatHistory;