import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./FloatingButton.css";

function FloatingButton(){

const navigate=useNavigate();

return(

<button

className="floating-ai"

onClick={()=>navigate("/chat")}

>

<FaRobot/>

</button>

);

}

export default FloatingButton;