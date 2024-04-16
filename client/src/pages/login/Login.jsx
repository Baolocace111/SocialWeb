import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import LanguageSwitcher from "../../components/languageSwitcher/LanguageSwitcher";
// import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useLanguage } from "../../context/languageContext";
const Login = () => {
  const { trl } = useLanguage();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      console.log(err.response);

      setErr(err.response.data.toString());
    }
  };

  return (
    <div className="login">
      <div className="float">
        <LanguageSwitcher text={true}></LanguageSwitcher>
      </div>
      <div className="card">
        <div className="left">
          <h1>{trl("welcome")}</h1>
          <p>{trl("explore_opportunities")}</p>
          <span>{trl("new_here")}</span>
          <Link to="/register">
            <button className="register-btn">{trl("create_account")}</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
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
            {err && <div className="error">{err}</div>}
            <button type="submit" onClick={handleLogin}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
