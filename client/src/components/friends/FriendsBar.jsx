import "./friendsBar.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faLightbulb,
  faGear,
  faAddressCard
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
const FriendsBar = () => {
  const { trl } = useLanguage();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const path = location.pathname;
    const pathSegments = path.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    setSelectedItem(lastSegment);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  const isItemSelected = (item) => {
    return item === selectedItem;
  };
  return (
    <div className="friends-bar">
      <div className="container">
        <div className="friends-title">
          <span>{trl("Bạn bè")}</span>
          <button className="icon">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
        <div className="menu">
          <Link
            to={`/friends/requests`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`item ${isItemSelected("requests") ? "selected" : ""}`}
              onClick={() => handleItemClick("requests")}
            >
              <div
                className={`icon-button ${isItemSelected("requests") ? "selected" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faUserPlus} size="lg" />
              </div>
              <span>{trl("Lời mời kết bạn")}</span>
            </div>
          </Link>
          <Link
            to={`/friends/suggestions`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`item ${isItemSelected("suggestions") ? "selected" : ""
                }`}
              onClick={() => handleItemClick("suggestions")}
            >
              <div
                className={`icon-button ${isItemSelected("suggestions") ? "selected" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faLightbulb} size="lg" />
              </div>
              <span>{trl("Gợi ý")}</span>
            </div>
          </Link>
          <Link
            to={`/friends/dashboard`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`item ${isItemSelected("dashboard") ? "selected" : ""
                }`}
              onClick={() => handleItemClick("dashboard")}
            >
              <div
                className={`icon-button ${isItemSelected("dashboard") ? "selected" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faAddressCard} size="lg" />
              </div>
              <span>{trl("Bạn bè")}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default FriendsBar;
