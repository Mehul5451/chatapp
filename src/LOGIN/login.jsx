import { useState } from "react";
import "../CSS/login.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleinput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", user);
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Login failed. Check console.");
      }
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chat-header">
        <img src="/images/mchatlogo.png" alt="MCHAT" className="chat-logo" />
        <h2>Welcome Back</h2>
        <p>Log in to continue the conversation</p>
      </div>

      <div className="chat-messages">
        <div className="chat-bubble login-form-bubble">
          <form onSubmit={handlelogin}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleinput}
              placeholder="you@example.com"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleinput}
              placeholder="••••••••"
              required
            />

            <button type="submit" className="chat-submit-btn">Login</button>
            <p style={{textAlign:"center"}}>new user <NavLink to="/signup">Register</NavLink></p>
          </form>
        </div>
      </div>
    </div>
  );
};
