import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
// import { FaFacebook, FaGoogle } from 'react-icons/fa';

const Login = () => {
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

  const handleSocialLogin = (socialNetwork) => {
    console.log(`Logging in with ${socialNetwork}`);
    // Here you would implement the social login logic
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Welcome Back!</h1>
          <p>
            Join us and start your journey again. Explore new opportunities and expand your horizons.
          </p>
          <span>New here?</span>
          <Link to="/register">
            <button className="register-btn">Create Account</button>
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
            <button type="submit" onClick={handleLogin}>Sign In</button>

            <div className="social-login-buttons">
              <button type="button" className="social-btn google" onClick={() => handleSocialLogin('Google')}>
                Login with Google
              </button>
              <button type="button" className="social-btn facebook" onClick={() => handleSocialLogin('Facebook')}>
                Login with Facebook
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;