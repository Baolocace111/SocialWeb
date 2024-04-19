import { useNavigate } from "react-router-dom";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./groupTab.scss";

const GroupTab = ({ group }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(group.joined);

  const handleClickToGroup = () => {
    navigate(`/groups/${group.id}`);
  };

  const handleJoinGroup = async () => {
    setStatus(-3); // Đang gửi yêu cầu

    try {
      const response = await makeRequest.post("joins/join", {
        groupId: group.id,
      });
      if (response && response.data) {
        setStatus(1); // Đã gửi yêu cầu tham gia và đang chờ duyệt
      }
    } catch (error) {
      console.error("Error joining group:", error);
      setStatus(-2); // Xảy ra lỗi
    }
  };

  const getDefaultOrUploadedAvatar = () => {
    const defaultAvatar =
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";
    return group.group_avatar === defaultAvatar
      ? group.group_avatar
      : `${URL_OF_BACK_END}groups/${group.id}/avatar`;
  };

  return (
    <div className="groupTab">
      <img
        src={getDefaultOrUploadedAvatar()}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/upload/errorImage.png";
        }}
        alt={""}
        onClick={handleClickToGroup}
      />
      <div className="about-group">
        <div className="group-name" onClick={handleClickToGroup}>
          {group.group_name}
        </div>
        <div className="group-privacy">
          {group.privacy_level === 0 ? "Riêng tư" : "Công khai"}
          <FontAwesomeIcon
            icon={faCircle}
            style={{ fontSize: "2px", margin: "0 5px" }}
          />
          {group.member_count + " thành viên"}
        </div>
        <div className="group-intro">{group.group_intro}</div>
      </div>
      {status === 0 && (
        <div className="group-join" onClick={handleJoinGroup}>
          <span>Tham gia</span>
        </div>
      )}
      {status === 1 && (
        <div className="group-join">
          <span>Chờ duyệt</span>
        </div>
      )}
      {status === 2 && (
        <div className="group-view" onClick={handleClickToGroup}>
          <span>Truy cập</span>
        </div>
      )}
      {status === -2 && (
        <div className="error-message">
          <span>Có lỗi xảy ra...</span>
        </div>
      )}
      {status === -3 && (
        <div className="loading">
          <span>Đang tải...</span>
        </div>
      )}
    </div>
  );
};
export default GroupTab;
