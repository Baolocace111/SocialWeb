import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { AuthContext } from "../../../context/authContext";
import { useLanguage } from "../../../context/languageContext";
import LanguageSwitcher from "../../../components/languageSwitcher/LanguageSwitcher";
import "./adminLogin.scss";
const AdminLogin = () => {
  const { trl } = useLanguage();
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { setCurrentUser } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    await makeRequest
      .post("auth/admin/login", inputs)
      .then((res) => {
        setCurrentUser(res.data);
        navigate("/admin/home");
      })
      .catch((err) => {
        setErr(err.response.data);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{trl("Admin Only")}</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder={trl("Admin account")}
              name="username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder={trl("Password")}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          {err && <span className="error-message">{trl(err)}</span>}
          <button type="submit">{trl("Login")}</button>
        </form>
      </div>
      <LanguageSwitcher text={true} />
    </div>
  );
};

export default AdminLogin;
