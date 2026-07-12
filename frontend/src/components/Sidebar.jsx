import { NavLink } from "react-router-dom";

import {

FaHome,
FaComments,
FaSearch,
FaChartBar,
FaInfoCircle,
FaSignOutAlt,
FaChevronRight,
FaStethoscope,

} from "react-icons/fa";

import ThemeToggle from "./ThemeToggle";

import "./Sidebar.css";

function Sidebar(){

const menu=[

{
title:"Dashboard",
icon:<FaHome/>,
path:"/home",
},

{
title:"AI Assistant",
icon:<FaComments/>,
path:"/chat",
},

{
title:"Search",
icon:<FaSearch/>,
path:"/search",
},

{
title:"Analytics",
icon:<FaChartBar/>,
path:"/analytics",
},

{
title:"About",
icon:<FaInfoCircle/>,
path:"/about",
},

];

return(

<aside className="sidebar">

<div>

<div className="sidebar-logo">

<div className="logo-icon">

<FaStethoscope/>

</div>

<div>

<h2>

MedAI

</h2>

<p>

Medical Research Assistant

</p>

</div>

</div>

<nav className="sidebar-nav">

{

menu.map((item)=>(

<NavLink

key={item.title}

to={item.path}

className={({isActive})=>

isActive

?

"sidebar-link active"

:

"sidebar-link"

}

>

<div className="link-left">

{item.icon}

<span>

{item.title}

</span>

</div>

<FaChevronRight className="arrow-icon"/>

</NavLink>

))

}

</nav>

</div>

<div className="sidebar-footer">

<ThemeToggle/>

<div className="version">

Version 1.0

</div>

<NavLink

to="/"

className="logout-btn"

>

<FaSignOutAlt/>

<span>

Logout

</span>

</NavLink>

</div>

</aside>

);

}

export default Sidebar;