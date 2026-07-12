import {

FaRobot,
FaFileMedical,
FaComments,
FaClock,

} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/Home.css";

import StatsCard from "../components/StatsCard";
import ActivityCard from "../components/ActivityCard";
import StatusCard from "../components/StatusCard";

import { dashboardStats } from "../utils/dashboardData";

function Home() {

const icons=[

<FaFileMedical/>,

<FaComments/>,

<FaRobot/>,

<FaClock/>,

];

return(

<div className="home-page fade-up">

<div className="hero-card">

<div>

<span className="hero-badge">

🚀 AI Powered

</span>

<h1>

Medical Research AI Assistant

</h1>

<p>

Upload research papers, search using RAG,
and get intelligent answers powered by
Gemini AI.

</p>

<div className="hero-buttons">

<Link
to="/chat"
className="primary-btn"
>

Start Chat

</Link>

<Link
to="/about"
className="secondary-btn"
>

Learn More

</Link>

</div>

</div>

<FaRobot className="hero-icon"/>

</div>

<div className="stats-grid">

{

dashboardStats.map((item,index)=>(

<StatsCard

key={index}

icon={icons[index]}

title={item.title}

value={item.value}

subtitle={item.subtitle}

color={item.color}

/>

))

}

</div>

<div className="dashboard-grid">

<ActivityCard/>

<StatusCard/>

</div>

</div>

);

}

export default Home;