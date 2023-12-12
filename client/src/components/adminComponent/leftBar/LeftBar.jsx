import "./leftBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
const AdminLeftBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
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
      <div className="admin-leftBar">
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
