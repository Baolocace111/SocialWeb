import "./leftBar.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import LanguageSwitcher from "../../languageSwitcher/LanguageSwitcher";
import { useLanguage } from "../../../context/languageContext";
const AdminLeftBar = () => {
  const { trl } = useLanguage();
  const { currentUser, logout } = useContext(AuthContext);
  const [showBar, setShowBar] = useState(false);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post("/auth/logout");
      logout();
      window.location.href = "/adminlogin";
    } catch (err) {
      alert(err.response.data);
    }
  };
  return (
    <div className={"admin-leftBar" + (showBar ? " admin-showbar" : "")}>
      <div
        className="show-btn"
        onClick={() => {
          setShowBar(!showBar);
        }}
      >
        <FontAwesomeIcon icon={faRightToBracket} />
      </div>
      <div className="admin-user-info">
        <img
          src={"/upload/" + currentUser.profilePic}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/upload/errorImage.png";
          }}
          alt={""}
        />
        {currentUser.name}
      </div>
      <div
        className="click-tag"
        onClick={() => {
          window.location.href = "/admin/home";
        }}
      >
        {" "}
        {trl("Post Management")}{" "}
      </div>
      <div
        className="click-tag"
        onClick={() => {
          window.location.href = "/admin/user";
        }}
      >
        {" "}
        {trl("User Management")}{" "}
      </div>
      <div
        className="click-tag"
        onClick={() => {
          window.location.href = "/admin/feedback";
        }}
      >
        {" "}
        {trl("Feedback Management")}{" "}
      </div>
      {false && (
        <div
          className="click-tag"
          onClick={() => {
            window.location.href = "/admin/language";
          }}
        >
          {" "}
          Language Management{" "}
        </div>
      )}
      <div>
        {" "}
        <LanguageSwitcher text={true}></LanguageSwitcher>
      </div>
      <div className="click-tag" onClick={handleLogout}>
        {trl("Logout")}
      </div>
    </div>
  );
};
export default AdminLeftBar;
