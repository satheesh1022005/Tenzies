import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './auth.css';
function Login({ userName, setUserName,id,setId }) {
  const [data, setData] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const [Message, setMessage] = useState("");

  function handleSubmit() {
    axios
      .post("https://tenzies-nv63.onrender.com/login", data)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log(res.data.id); // Successful login message
          console.log(res.data);
          setMessage(res.data.message);
          setUserName(data.username);
          
          setId(res.data.id)
          localStorage.setItem("userName", data.username);
          localStorage.setItem("userId", res.data.id);
          localStorage.setItem("userPassword", data.password); // No need to store the password in localStorage
          navigate("/home");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setMessage("Username/password incorrect");
        } else if (err.response.status === 400) {
          setMessage("User does not exist. Sign up to create an account.");
        } else {
          setMessage("An error occurred. Please try again later.");
        }
      });
    setData({
      username: "",
      password: ""
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value
      };
      return newState;
    });
  }

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <label htmlFor="username">User name</label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="user name"
        value={data.username}
        onChange={handleChange}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={handleChange}
      />
      <button type="submit" onClick={handleSubmit}>
        Login
      </button>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p>
        <a href="/forgot-password">Forgot Password?</a>
      </p>
      <p>
        <a href="/reset-password">Reset Password</a>
      </p>
      <p>
        <a href="/">Back to Home</a>
      </p>
      {Message && <p className="err">{Message}</p>}
    </div>
  );
}

export default Login;