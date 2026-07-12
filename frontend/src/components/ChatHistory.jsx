import { useState } from "react";
import {
  FaHistory,
  FaSearch,
  FaComments,
} from "react-icons/fa";

import "./ChatHistory.css";

function ChatHistory({
  history,
  onSelect,
}) {

  const [search,setSearch]=useState("");

  const filteredHistory = history.filter((chat)=>

    chat.title
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  return(

    <div className="history-container">

      <div className="history-header">

        <FaHistory/>

        <h3>Recent Chats</h3>

      </div>

      <div className="history-search-box">

        <FaSearch/>

        <input

          type="text"

          placeholder="Search chats..."

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

        />

      </div>

      <div className="history-list">

        {filteredHistory.length===0 ? (

          <div className="empty-history">

            <FaComments/>

            <p>No conversations yet.</p>

          </div>

        ) : (

          filteredHistory.map((chat,index)=>(

            <div

              key={index}

              className="history-card"

              onClick={()=>
                onSelect(chat)
              }

            >

              <h4>

                {chat.title}

              </h4>

              <span>

                {chat.time}

              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default ChatHistory;