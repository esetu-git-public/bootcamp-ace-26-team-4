import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    // get registered user from localStorage
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
      alert("No registered user found. Please register first.");
      return;
    }

    // check login details
    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login Successful!");
      navigate("/home");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Medical Research Paper Assistant</h1>
        <p>Login to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p className="login-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;