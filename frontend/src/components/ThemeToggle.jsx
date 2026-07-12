import {

FaMoon,
FaSun,

} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

function ThemeToggle(){

const{

darkMode,
setDarkMode,

}=useTheme();

return(

<button

className="theme-btn"

onClick={()=>setDarkMode(!darkMode)}

>

{

darkMode

?

<FaSun/>

:

<FaMoon/>

}

</button>

);

}

export default ThemeToggle;