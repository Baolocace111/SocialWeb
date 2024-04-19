import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { URL_OF_BACK_END } from "../../axios";
import { useLanguage } from "../../context/languageContext";
const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { trl } = useLanguage();
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div
            className="user"
            onClick={() => {
              window.location.href = `/profile/${currentUser.id}`;
            }}
          >
            <img
              src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={""}
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <span>{trl("Friends")}</span>
          </div>
          <div
            className="item"
            onClick={() => {
              window.location.href = `/groups/discover`;
            }}
          >
            <img src={Groups} alt="" />
            <span>{trl("Groups")}</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>{trl("Marketplace")}</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>{trl("Watch")}</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>{trl("Memories")}</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>{trl("Events")}</span>
          </div>
          <div
            className="item"
            onClick={() => {
              window.location.href = `/game/caro`;
            }}
          >
            <img src={Gaming} alt="" />
            <span>{trl("Gaming")}</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>{trl("Gallery")}</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>{trl("Videos")}</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>{trl("Messages")}</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>{"Others"}</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>{trl("Fundraiser")}</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>{trl("Tutorials")}</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>{trl("Courses")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
