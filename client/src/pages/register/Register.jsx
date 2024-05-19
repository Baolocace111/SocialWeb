import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import LanguageSwitcher from "../../components/languageSwitcher/LanguageSwitcher";
import { makeRequest } from "../../axios";
import { useLanguage } from "../../context/languageContext";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
import CircleProgressBar from "../../components/loadingComponent/CircleProgressBar/CircleProgressBar";
import Dotfloating from "../../components/loadingComponent/dotfloating/Dotfloating";
const Register = () => {
  const { trl } = useLanguage();
  const [checkConnection, setCheckConnection] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const closePopup = () => {
    setCheckConnection(false);
  };
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
    if (!registerLoading) {
      setRegisterLoading(true);
      try {
        makeRequest
          .post("/auth/register", inputs)
          .then((response) => {
            setMessage(response.data); // Assuming response has a message field
            setRegisterLoading(false);
          })
          .catch((error) => {
            setMessage(error.response.data.message); // Assuming error response has a message field
            setRegisterLoading(false);
          });
      } catch (err) {
        setMessage(err.response.data.message); // Assuming error response has a message field
        setRegisterLoading(false);
      }
    }
  };

  return (
    <div className="register">
      <PopupWindow show={checkConnection}>
        <CircleProgressBar handleClose={closePopup}></CircleProgressBar>
      </PopupWindow>
      <div className="float">
        <LanguageSwitcher text={true}></LanguageSwitcher>
      </div>
      <div className="card">
        <div className="left">
          <h1>{trl("welcome")}</h1>
          <p>{trl("Join_the_community")}</p>
          <span>{trl("Already have an account?")}</span>
          <Link to="/login">
            <button className="login-btn">{trl("login")}</button>
          </Link>
        </div>
        <div className="right">
          <h1>{trl("Create Account")}</h1>
          <form>
            <input
              type="text"
              placeholder={trl("Username")}
              name="username"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder={trl("Email")}
              name="email"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder={trl("Name")}
              name="name"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder={trl("Password")}
              name="password"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder={trl("Confirm Password")}
              name="repassword"
              onChange={handleChange}
              required
            />
            {message && <div className="message">{trl(message)}</div>}
          </form>
          <button onClick={handleClick}>
            {" "}
            {registerLoading ? <Dotfloating /> : <h3>{trl("Sign Up")}</h3>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
