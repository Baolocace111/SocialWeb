import "./groupCreate.scss";
import { useLanguage } from "../../../context/languageContext";
import React, { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/authContext";
import { URL_OF_BACK_END } from "../../../axios";
import { makeRequest } from "../../../axios";
import { useNavigate } from "react-router-dom";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
const GroupCreate = ({
  setGroupPrivacy,
  groupPrivacy,
  setGroupName,
  groupName,
}) => {
  const { trl } = useLanguage();
  const { currentUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(groupName || "");
  const navigate = useNavigate();

  const handleGroupNameChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleGroupNameBlur = () => {
    setGroupName(inputValue);
    setShowDropdown(false);
  };

  const handlePrivacyChange = (choice) => {
    setGroupPrivacy(choice);
    setShowDropdown(false);
  };

  const displayPrivacy = groupPrivacy || trl("Chọn quyền riêng tư");

  // Mutation để tạo nhóm mới
  const createGroupMutation = useMutation((newGroup) =>
    makeRequest.post("/groups/create", newGroup)
  );

  // Hàm xử lý khi bấm nút "Tạo"
  const handleCreateGroup = () => {
    if (!inputValue || !groupPrivacy) {
      alert(trl("Vui lòng nhập tên nhóm và chọn quyền riêng tư cho nhóm."));
      return;
    }

    const privacyLevel = groupPrivacy === trl("Công khai") ? 1 : 0;
    createGroupMutation.mutate({
      group_name: inputValue,
      privacy_level: privacyLevel,
      created_by: currentUser.id,
    });
    navigate("/");
  };

  return (
    <div className="group-create">
      <div className="container">
        <div className="header">
          <div className="close">
            <FontAwesomeIcon
              icon={faX}
              onClick={() => {
                window.location.href = `/groups/discover`;
              }}
            />
          </div>
        </div>
        <div className="create-form">
          <span className="title">{trl("Tạo Nhóm")}</span>
          <div className="create">
            <div className="creator">
              <img
                src={`${URL_OF_BACK_END}users/profilePic/${currentUser.id}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt={""}
              />
              <div className="info">
                <span className="admin">{currentUser.name}</span>
                <span>{trl("Quản trị viên")}</span>
              </div>
            </div>
            <div className="form-input">
              <div className="input-group">
                <label htmlFor="group-name">{trl("Tên nhóm")}</label>
                <input
                  type="text"
                  id="group-name"
                  placeholder={trl("Nhập tên nhóm")}
                  value={inputValue}
                  onChange={handleGroupNameChange}
                  onBlur={handleGroupNameBlur}
                />
              </div>
              <div className="input-group">
                <div className="dropdown">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    id="privacy-choice"
                  >
                    {displayPrivacy} <FontAwesomeIcon icon={faCaretDown} />
                  </button>
                  {showDropdown && (
                    <div
                      className={`dropdown-content ${
                        showDropdown ? "show" : ""
                      }`}
                    >
                      <div
                        className="dropdown-item"
                        onClick={() => handlePrivacyChange(trl("Công khai"))}
                      >
                        {trl("Công khai")}
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => handlePrivacyChange(trl("Riêng tư"))}
                      >
                        {trl("Riêng tư")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="invite-friends">
                  {trl("Mời bạn bè (không bắt buộc)")}
                </label>
                <input
                  type="text"
                  id="invite-friends"
                  placeholder={trl("Nhập tên bạn bè")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="finish-create">
          <div className="create-btn" onClick={handleCreateGroup}>
            <span>{trl("Tạo")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreate;
