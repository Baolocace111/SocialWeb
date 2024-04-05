import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";

import { makeRequest } from "../../axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
    name: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    try {
      makeRequest
        .post("/auth/register", inputs)
        .then((response) => {
          setMessage(response.data); // Assuming response has a message field
        })
        .catch((error) => {
          setMessage(error.response.data.message); // Assuming error response has a message field
        });
    } catch (err) {
      setMessage(err.response.data.message); // Assuming error response has a message field
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Welcome</h1>
          <p>Join the community and explore the endless possibilities.</p>
          <span>Already have an account?</span>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Create Account</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="repassword"
              onChange={handleChange}
              required
            />
            {message && <div className="message">{message}</div>}
          </form>
          <button onClick={handleClick}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
