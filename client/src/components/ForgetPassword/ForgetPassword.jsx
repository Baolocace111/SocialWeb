import "./forgetPassword.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/languageContext";
import { useState } from "react";
import { makeRequest } from "../../axios";
import Dotfloating from "../loadingComponent/dotfloating/Dotfloating";
const ForgetPassword = ({ handleReturn }) => {
  const { trl, language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [confirmCodeInput, setConfirmCodeInput] = useState(false);
  const [account, setAccount] = useState("");
  const [inputs, setInputs] = useState({
    email: "",
    verification: "",
    password: "",
    repassword: "",
  });
  const handleSendEmail = () => {
    if (!isLoading) {
      setIsLoading(true);
      makeRequest
        .post("/auth/sendfpcode", {
          email: inputs.email,
          language: language,
        })
        .then((response) => {
          setError(false);
          setAccount(response.data.account);
          setMessage(response.data.message); // Assuming response has a message field
          setIsLoading(false);
          setConfirmCodeInput(true);
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data); // Assuming error response has a message field
          setIsLoading(false);
        });
    }
  };
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleForgetPassword = () => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        makeRequest
          .post("/auth/getfp", inputs)
          .then((response) => {
            setError(false);
            setMessage(response.data); // Assuming response has a message field
            setIsLoading(false);
          })
          .catch((error) => {
            setError(true);
            setMessage(error.response.data); // Assuming error response has a message field
            setIsLoading(false);
          });
      } catch (err) {
        setError(true);
        setMessage(err.response.data); // Assuming error response has a message field
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="forgetPassword">
      <div className="rtrBtn" onClick={handleReturn}>
        <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
      </div>
      <div className="mainform">
        <h1>{trl("Forget password")}</h1>
        <div className="form">
          <div className="inputbox">
            <input
              type="email"
              placeholder={trl("Email")}
              name="email"
              onChange={handleChange}
              required
            />
            <button onClick={handleSendEmail} type="button">
              {isLoading ? "..." : trl("Send")}
            </button>
          </div>
          {confirmCodeInput && (
            <div className="inputbox">
              <span>{trl("Tài khoản") + ":" + account}</span>
            </div>
          )}
          {confirmCodeInput && (
            <div className="inputbox">
              <input
                placeholder={trl("Verification Code")}
                name="verification"
                onChange={handleChange}
                required
              />
            </div>
          )}
          {confirmCodeInput && (
            <div className="inputbox">
              <input
                type="password"
                placeholder={trl("Password")}
                name="password"
                onChange={handleChange}
                required
              />
            </div>
          )}
          {confirmCodeInput && (
            <div className="inputbox">
              <input
                type="password"
                placeholder={trl("Confirm Password")}
                name="repassword"
                onChange={handleChange}
                required
              />
            </div>
          )}
          {message && (
            <div className={error ? "error" : "message"}>{trl(message)}</div>
          )}
          {confirmCodeInput && (
            <button onClick={handleForgetPassword}>
              {isLoading ? (
                <Dotfloating></Dotfloating>
              ) : (
                trl("Change Your Password")
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgetPassword;
