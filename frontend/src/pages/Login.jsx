import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Login(){

const navigate=useNavigate();

const[email,setEmail]=useState("");

const[password,setPassword]=useState("");

const login=(e)=>{

e.preventDefault();

navigate("/home");

};

return(

<div className="auth-page">

<form
className="auth-card"
onSubmit={login}
>

<h1>

MedAI

</h1>

<p>

Medical Research Assistant

</p>

<input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>

<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>

<button>

Login

</button>

<Link to="/register">

Create Account

</Link>

</form>

</div>

);

}

export default Login;