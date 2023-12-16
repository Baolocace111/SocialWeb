import "./leftBar.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const AdminLeftBar = () => {
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
    <>
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
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          {currentUser.name}
        </div>
        <div className="click-tag" onClick={handleLogout}>
          Đăng xuất
        </div>
      </div>
    </>
  );
};
export default AdminLeftBar;
