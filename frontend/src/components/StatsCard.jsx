import { useEffect, useState } from "react";

function StatsCard({

icon,
title,
value,
subtitle,

}){

const[count,setCount]=useState(0);

useEffect(()=>{

if(isNaN(value)) return;

let current=0;

const timer=setInterval(()=>{

current++;

setCount(current);

if(current>=Number(value))

clearInterval(timer);

},30);

return()=>clearInterval(timer);

},[value]);

return(

<div className="stat-card">

<div className="stat-icon">

{icon}

</div>

<div>

<h2>

{

isNaN(value)

?

value

:

count

}

</h2>

<h4>

{title}

</h4>

<p>

{subtitle}

</p>

</div>

</div>

);

}

export default StatsCard;