import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../axios";
const AdminLogin = () => {
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  //const {login}=useContext(Au)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post("auth/admin/login", inputs);
      navigate("/admin/home");
    } catch (error) {
      //console.log(error);
      setErr(error.response.data);
    }
  };
  return (
    <>
      <div className="login">
        <h1>Admin Only</h1>
        <form>
          <input
            type="text"
            placeholder="Admin account"
            name="username"
            onChange={handleChange}
            required
          ></input>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          ></input>
          <span style={{ color: "red" }}>{err && err}</span>
        </form>
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
};
export default AdminLogin;
