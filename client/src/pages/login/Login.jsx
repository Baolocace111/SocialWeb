import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import LanguageSwitcher from "../../components/languageSwitcher/LanguageSwitcher";
// import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useLanguage } from "../../context/languageContext";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
import CircleProgressBar from "../../components/loadingComponent/CircleProgressBar/CircleProgressBar";
import Dotfloating from "../../components/loadingComponent/dotfloating/Dotfloating";
import ForgetPassword from "../../components/ForgetPassword/ForgetPassword";
const Login = () => {
  const { trl } = useLanguage();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [checkConnection, setCheckConnection] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const navigate = useNavigate();
  const closePopup = () => {
    setCheckConnection(false);
  };
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    if (!loginLoading) {
      await setLoginLoading(true);
      e.preventDefault();
      try {
        await login(inputs);
        navigate("/");
      } catch (err) {
        //console.log(err.response);

        setErr(err.response.data.toString());
        setLoginLoading(false);
      }
    }
  };

  return (
    <div className="login">
      <PopupWindow show={checkConnection} handleClose={() => {}}>
        <CircleProgressBar handleClose={closePopup}></CircleProgressBar>
      </PopupWindow>
      <PopupWindow show={forgetPassword} handleClose={() => {}}>
        <ForgetPassword
          handleReturn={() => {
            setForgetPassword(false);
          }}
        ></ForgetPassword>
      </PopupWindow>
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
          <h1>{trl("login")}</h1>
          <form>
            <input
              type="text"
              placeholder={trl("Username")}
              name="username"
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
            {err && <div className="error">{trl(err)}</div>}
            <div className="fgpass">
              <h5
                onClick={() => {
                  setForgetPassword(true);
                }}
              >
                {trl("Forget password")}
              </h5>
            </div>
            <button type="button" onClick={handleLogin}>
              {loginLoading ? (
                <Dotfloating></Dotfloating>
              ) : (
                <h3>{trl("Sign In")}</h3>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
