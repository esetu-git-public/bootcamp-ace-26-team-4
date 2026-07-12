import TypingMessage from "./TypingMessage";

import {

FaRobot,
FaUser,
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

{chatMessages.map((msg,index)=>(

<div
key={index}
className={`message ${msg.role}`}
>

<div className="avatar">

{msg.role==="bot"

?<FaRobot/>

:<FaUser/>

}

</div>

<div className="bubble">

<TypingMessage

text={msg.text}

/>

{msg.references && (

<details className="reference-box">

<summary>

📚 References

</summary>

<pre>

{msg.references}

</pre>

</details>

)}

{msg.metadata && (

<div className="confidence">

Confidence :
<b>

{" "}
{msg.metadata.retrieval_confidence_level}

</b>

</div>

)}

<div className="bubble-footer">

<span>

{msg.time}

</span>

{msg.role==="bot" && (

<div className="bubble-actions">

<button

className="icon-btn"

onClick={()=>copyMessage(msg.text)}

>

<FaCopy/>

</button>

{msg.question && (

<button

className="icon-btn"

onClick={()=>regenerateAnswer(msg.question)}

>

<FaRedo/>

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

<div className="avatar">

<FaRobot/>

</div>

<div className="bubble typing-bubble">

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