import "./groupContent.scss";
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassStart,
  faBan,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
const GroupContent = () => {
  const { trl } = useLanguage();
  const { groupId } = useParams();
  const location = useLocation();

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const isItemSelected = (item) => {
    return item === selectedItem;
  };

  useEffect(() => {
    const path = location.pathname;
    const pathSegments = path.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    !isNaN(lastSegment) ? setSelectedItem(null) : setSelectedItem(lastSegment);
  }, [location.pathname]);

  return (
    <div className="group-content">
      <div className="container">
        <div className="manage-title">
          <span>{trl("Nội dung của bạn")}</span>
          <span className="description">
            {trl("Quản lý và xem bài viết của bạn trong nhóm này.")}
          </span>
        </div>
        <div className="manage-section">
          <div className="menu-box">
            <Link
              to={`/groups/${groupId}/my-content/pending`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className={`menu-item ${
                  isItemSelected("pending") || isItemSelected("my-content")
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleItemClick("pending")}
              >
                <div
                  className={`icon-box ${
                    isItemSelected("pending") || isItemSelected("my-content")
                      ? "selected"
                      : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faHourglassStart} />
                </div>
                <span>{trl("Đang chờ")}</span>
              </div>
            </Link>
            <Link
              to={`/groups/${groupId}/my-content/posted`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className={`menu-item ${
                  isItemSelected("posted") ? "selected" : ""
                }`}
                onClick={() => handleItemClick("posted")}
              >
                <div
                  className={`icon-box ${
                    isItemSelected("posted") ? "selected" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <span>{trl("Đã đăng")}</span>
              </div>
            </Link>
            <Link
              to={`/groups/${groupId}/my-content/declined`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className={`menu-item ${
                  isItemSelected("declined") ? "selected" : ""
                }`}
                onClick={() => handleItemClick("declined")}
              >
                <div
                  className={`icon-box ${
                    isItemSelected("declined") ? "selected" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faBan} />
                </div>
                <span>{trl("Bị từ chối")}</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="finish-manage"></div>
      </div>
    </div>
  );
};

export default GroupContent;
