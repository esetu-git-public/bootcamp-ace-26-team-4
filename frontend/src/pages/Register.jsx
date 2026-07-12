import { Link,useNavigate } from "react-router-dom";

import { useState } from "react";

import "../styles/Auth.css";

function Register(){

const navigate=useNavigate();

const[name,setName]=useState("");

const[email,setEmail]=useState("");

const[password,setPassword]=useState("");

const register=(e)=>{

e.preventDefault();

navigate("/");

};

return(

<div className="auth-page">

<form
className="auth-card"
onSubmit={register}
>

<h1>

Create Account

</h1>

<input

placeholder="Full Name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>

<input

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

Register

</button>

<Link to="/">

Already have an account?

</Link>

</form>

</div>

);

}

export default Register;