import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { AuthContext } from "../../../context/authContext";
const AdminLogin = () => {
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
        //console.log(res);
        setCurrentUser(res.data);
        navigate("/admin/home");
      })
      .catch((err) => {
        console.log(err);
        setErr(err.response.data);
      });
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
