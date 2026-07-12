import {

FaFileMedical,
FaRobot,
FaComments,
FaClock,

} from "react-icons/fa";

import "../styles/Analytics.css";

function Analytics(){

const stats=[

{
title:"Research Papers",
value:"24",
icon:<FaFileMedical/>,
},

{
title:"Questions Asked",
value:"138",
icon:<FaComments/>,
},

{
title:"AI Accuracy",
value:"97%",
icon:<FaRobot/>,
},

{
title:"Average Response",
value:"1.2 sec",
icon:<FaClock/>,
},

];

return(

<div className="analytics-page fade-up">

<h1>

Analytics Dashboard

</h1>

<p>

Monitor AI Assistant performance.

</p>

<div className="analytics-grid">

{

stats.map((item,index)=>(

<div
className="analytics-card"
key={index}
>

<div className="analytics-icon">

{item.icon}

</div>

<h2>

{item.value}

</h2>

<h4>

{item.title}

</h4>

</div>

))

}

</div>

</div>

);

}

export default Analytics;