import { useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import FloatingButton from "./components/FloatingButton";

import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function App(){

const location=useLocation();

const hideSidebar=

location.pathname==="/" ||

location.pathname==="/register";

return(

<div className="app fade-up">

{

!hideSidebar &&

<Sidebar/>

}

<main

className={

hideSidebar

?

"main-content full-width"

:

"main-content"

}

>

<AppRoutes/>

</main>

{

!hideSidebar &&

<FloatingButton/>

}

</div>

);

}

export default App;