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

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      //const {isLoading,error,data}= axios.post("http://localhost:8800/api/auth/register", inputs);
      makeRequest
        .post("/auth/register", inputs)
        .then((response) => {
          setMessage(response.data);
        })
        .catch((error) => {
          setMessage(error.data);
        });
      //setMessage("User has been created!");
    } catch (err) {
      setMessage(err.response.data);
    }
  };

  //console.log(message);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
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
              placeholder="Re-enter Password"
              name="repassword"
              onChange={handleChange}
              required
            />
            {message && <p>{message}</p>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
