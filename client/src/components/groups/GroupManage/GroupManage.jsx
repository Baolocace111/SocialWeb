import "./groupManage.scss";
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faHouse,
  faLayerGroup,
  faUserPlus,
  faClock,
  faHeadset,
  faCircle,
  faLock,
  faEarthAmericas,
} from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext.js";
import { Link, useParams, useLocation } from "react-router-dom";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useQuery } from "@tanstack/react-query";

const GroupManage = () => {
  const { trl } = useLanguage();
  const { currentUser } = useContext(AuthContext);
  const { groupId } = useParams();
  const location = useLocation();

  const [activeDropdown_1, setActiveDropdown_1] = useState("adminTools_1");
  const [activeDropdown_2, setActiveDropdown_2] = useState("adminTools_2");
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

  // Hàm để toggle dropdown
  const toggleDropdown_1 = (dropdownName) => {
    if (activeDropdown_1 === dropdownName) {
      setActiveDropdown_1(null);
    } else {
      setActiveDropdown_1(dropdownName);
    }
  };
  const toggleDropdown_2 = (dropdownName) => {
    if (activeDropdown_2 === dropdownName) {
      setActiveDropdown_2(null);
    } else {
      setActiveDropdown_2(dropdownName);
    }
  };

  const getDefaultOrUploadedAvatar = () => {
    const defaultAvatar =
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

    return groupDetails.group_avatar === defaultAvatar
      ? groupDetails.group_avatar
      : `${URL_OF_BACK_END}groups/${groupId}/avatar`;
  };

  const groupDetailsQuery = useQuery(["groupDetails", groupId], () =>
    makeRequest.get(`/groups/${groupId}`)
  );
  const groupUsersQuery = useQuery(["groupUsers", groupId], () =>
    makeRequest.get(`/joins/groups/${groupId}/users`)
  );

  const isGroupLeader =
    groupDetailsQuery.data?.data[0]?.created_by === currentUser.id;
  const pendingRequestsQuery = useQuery(
    ["pendingRequestsCount", groupId],
    () => makeRequest.get(`/groups/${groupId}/pending-requests-count`),
    {
      enabled: !!groupDetailsQuery.data && isGroupLeader,
    }
  );
  const pendingPostsQuery = useQuery(
    ["pendingPostsCount", groupId],
    () => makeRequest.get(`/groups/${groupId}/pending-posts-count`),
    {
      enabled: !!groupDetailsQuery.data && isGroupLeader,
    }
  );

  const isLoading =
    groupDetailsQuery.isLoading ||
    groupUsersQuery.isLoading ||
    (isGroupLeader &&
      (pendingRequestsQuery.isLoading || pendingPostsQuery.isLoading));
  const error =
    groupDetailsQuery.error ||
    groupUsersQuery.error ||
    pendingRequestsQuery.error ||
    pendingPostsQuery.error;

  if (isLoading) {
    return <NineCube />;
  }

  if (error) {
    return <div className="error-message">Lỗi: {error.message}</div>;
  }

  const groupDetails = groupDetailsQuery.data?.data[0];
  const groupUsers = groupUsersQuery.data?.data;
  const pendingPostCount = isGroupLeader
    ? pendingPostsQuery.data?.data.count
    : 0;
  const pendingRequestCount = isGroupLeader
    ? pendingRequestsQuery.data?.data.count
    : 0;

  return (
    <div className="group-manage">
      <div className="container">
        {groupDetails && (
          <div className="manage-title">
            <img
              src={getDefaultOrUploadedAvatar()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={""}
              className="cover-image"
            />
            <div className="group-info">
              <h2 className="group-name">{groupDetails.group_name}</h2>
              <div className="privacy">
                {groupDetails.privacy_level === 0 ? (
                  <FontAwesomeIcon
                    icon={faLock}
                    size="xs"
                    style={{ marginRight: "7px" }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faEarthAmericas}
                    size="xs"
                    style={{ marginRight: "7px" }}
                  />
                )}
                {groupDetails.privacy_level === 0
                  ? trl("Nhóm Riêng tư")
                  : trl("Nhóm Công khai")}
                <FontAwesomeIcon
                  icon={faCircle}
                  style={{ fontSize: "2px", margin: "0 5px" }}
                />
                <span className="member-count">
                  {groupUsers.length} {trl("thành viên")}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="manage-section">
          {currentUser.id === groupDetails.created_by && (
            <div>
              <div className="menu-box">
                <Link
                  to={`/groups/${groupId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className={`menu-item ${
                      isItemSelected("main-page") || isItemSelected(null)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleItemClick("main-page")}
                  >
                    <FontAwesomeIcon
                      icon={faHouse}
                      style={{ marginRight: "8px" }}
                    />
                    <span>{trl("Trang chủ nhóm")}</span>
                  </div>
                </Link>
                <Link
                  to={`/groups/${groupId}/overview`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className={`menu-item ${
                      isItemSelected("overview") ? "selected" : ""
                    }`}
                    onClick={() => handleItemClick("overview")}
                  >
                    <FontAwesomeIcon
                      icon={faLayerGroup}
                      style={{ marginRight: "10px" }}
                    />
                    <span>{trl("Tổng quan")}</span>
                  </div>
                </Link>
              </div>
              <div className="dropdown-box">
                <div className="dropdown-menu">
                  <div
                    className="dropdown-header"
                    onClick={() => toggleDropdown_1("adminTools_1")}
                  >
                    <span>{trl("Công cụ quản trị")}</span>
                    {activeDropdown_1 === "adminTools_1" ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </div>
                  <div
                    className={`dropdown-content ${
                      activeDropdown_1 === "adminTools_1" ? "show" : ""
                    }`}
                  >
                    <Link
                      to={`/groups/${groupId}/member-requests`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        className={`dropdown-item ${
                          isItemSelected("member-requests") ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick("member-requests")}
                      >
                        <FontAwesomeIcon
                          icon={faUserPlus}
                          style={{ marginRight: "6px" }}
                        />
                        <div className="item-section">
                          <span>{trl("Yêu cầu làm thành viên")}</span>
                          <div className="count">
                            {pendingRequestCount > 0 && (
                              <div className="new"></div>
                            )}
                            <span>
                              {pendingRequestCount} {trl("mục mới")}
                            </span>
                          </div>
                        </div>
                        {pendingRequestCount > 0 && (
                          <div className="pending-num">
                            <span>{pendingRequestCount}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <Link
                      to={`/groups/${groupId}/pending_posts`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        className={`dropdown-item ${
                          isItemSelected("pending_posts") ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick("pending_posts")}
                      >
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ marginRight: "10px" }}
                        />
                        <div className="item-section">
                          <span>{trl("Bài viết đang chờ")}</span>
                          <div className="count">
                            {pendingPostCount > 0 && (
                              <div className="new"></div>
                            )}
                            <span>
                              {pendingPostCount} {trl("mục mới")}
                            </span>
                          </div>
                        </div>
                        {pendingPostCount > 0 && (
                          <div className="pending-num">
                            <span>{pendingPostCount}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <div
                    className="dropdown-header"
                    onClick={() => toggleDropdown_2("adminTools_2")}
                  >
                    <span>{trl("Trung tâm hỗ trợ")}</span>
                    {activeDropdown_2 === "adminTools_2" ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </div>
                  <div
                    className={`dropdown-content ${
                      activeDropdown_2 === "adminTools_2" ? "show" : ""
                    }`}
                  >
                    <div
                      className={`dropdown-item ${
                        isItemSelected("support") ? "selected" : ""
                      }`}
                      onClick={() => handleItemClick("support")}
                    >
                      <FontAwesomeIcon
                        icon={faHeadset}
                        style={{ marginRight: "10px" }}
                      />
                      <span>{trl("Nhắn tin trợ giúp")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="finish-manage"></div>
      </div>
    </div>
  );
};

export default GroupManage;
