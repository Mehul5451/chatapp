import { useState } from "react";
import "../CSS/signup.css";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
 

export const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
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

 const handlesubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("https://chatappbackend-nntq.onrender.com/submit", user);
    alert("Signup successful!");
    navigate("/login");
  } catch (error) {
    if (!error.response) {
      alert("Backend might be waking up, please retry in a few seconds.");
    } else {
      alert(error.response.data || "Signup failed.");
    }
  }
};


  return (
    <div className="chatbox-container">
      <div className="chat-header">
        <img src="/images/mchatlogo.png" alt="MCHAT" className="chat-logo" />
        <h2>Sign Up to MChat</h2>
      </div>

      <div className="chat-messages">
        <div className="chat-bubble signup-form-bubble">
          <form onSubmit={handlesubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleinput}
              placeholder="ENTER NAME"
              required
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleinput}
              placeholder="ENTER YOUR EMAIL"
              required
            />

            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleinput}
              placeholder="1234567890"
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

            <button type="submit" className="chat-submit-btn">Sign Up</button>
            <p style={{textAlign:"center"}}>already registered? <NavLink to ="/login">LOGIN</NavLink> </p>
          </form>
        </div>
      </div>
    </div>
  );
};
