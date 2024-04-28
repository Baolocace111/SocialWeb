import React, { useState, useEffect, useContext, useRef } from "react";
import { useLanguage } from "../../../context/languageContext";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios.js";
import { AuthContext } from "../../../context/authContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faEye,
  faLock,
  faEarthAmericas,
  faPen,
  faUpload,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import { URL_OF_BACK_END } from "../../../axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./groupPostDetail.scss";
import GroupPost from "../../../components/groups/GroupPost/GroupPost.jsx";

const GroupPostDetail = () => {
  const { trl } = useLanguage();
  const { currentUser } = useContext(AuthContext);
  const { groupId, postId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("discussion");
  const postRef = useRef(null);

  const [showPopover, setShowPopover] = useState(false);
  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const {
    data: groupData,
    isLoading: isGroupLoading,
    error: groupError,
  } = useQuery(["group-details", groupId], () =>
    makeRequest.get(`/groups/${groupId}`).then((res) => res.data[0])
  );

  const {
    data: members,
    isLoading: isMembersLoading,
    error: membersError,
  } = useQuery(["group-members", groupId], () =>
    makeRequest.get(`/joins/groups/${groupId}/users`).then((res) => res.data)
  );

  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery(["group-post", postId], () =>
    makeRequest.get(`/posts/post/${postId}`).then((res) => res.data)
  );

  useEffect(() => {
    if (post && postRef.current) {
      postRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [post]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
    togglePopover();
  };

  const queryClient = useQueryClient();

  const groupAvatarMutation = useMutation(
    (image) => {
      return makeRequest.put(`/groups/${groupId}/update/avatar`, image);
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch
        setSelectedImage(null);
        setSelectedImageFile(null);
        queryClient.invalidateQueries(["group-detail", groupId]);
      },
    }
  );

  const handleSave = async () => {
    if (!selectedImageFile) return;

    const formData = new FormData();
    formData.append("file", selectedImageFile);

    try {
      await groupAvatarMutation.mutateAsync(formData);
      window.location.reload();
    } catch (error) {
      console.error("Error while uploading image:", error);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
  };

  if (isGroupLoading || isMembersLoading || isPostLoading) return <NineCube />;
  if (groupError)
    return <div className="error-message">Lỗi: {groupError.message}</div>;
  if (membersError)
    return <div className="error-message">Lỗi: {membersError.message}</div>;
  if (postError)
    return <div className="error-message">Lỗi: {postError.message}</div>;

  let introContent;
  if (groupData.privacy_level === 0) {
    introContent = (
      <div>
        <div className="intro-privacy">
          <FontAwesomeIcon icon={faLock} style={{ marginTop: "4px" }} />
          <div className="content">
            <span className="intro-title">{trl("Riêng tư")}</span>
            <span className="intro-content">
              {trl(
                "Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng."
              )}
            </span>
          </div>
        </div>
        <div className="intro-privacy">
          <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px" }} />
          <div className="content">
            <span className="intro-title">{trl("Hiển thị")}</span>
            <span className="intro-content">
              {trl("Ai cũng có thể tìm thấy nhóm này.")}
            </span>
          </div>
        </div>
      </div>
    );
  } else if (groupData.privacy_level === 1) {
    introContent = (
      <div>
        <div className="intro-privacy">
          <FontAwesomeIcon
            icon={faEarthAmericas}
            style={{ marginTop: "4px" }}
          />
          <div className="content">
            <span className="intro-title">{trl("Công khai")}</span>
            <span className="intro-content">
              {trl(
                "Ai cũng nhìn thấy mọi người trong nhóm và những gì họ đăng."
              )}
            </span>
          </div>
        </div>
        <div className="intro-privacy">
          <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px" }} />
          <div className="content">
            <span className="intro-title">{trl("Hiển thị")}</span>
            <span className="intro-content">
              {trl("Ai cũng có thể tìm thấy nhóm này.")}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    introContent = null;
  }

  const getDefaultOrUploadedAvatar = () => {
    const defaultAvatar =
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

    return groupData.group_avatar === defaultAvatar
      ? groupData.group_avatar
      : `${URL_OF_BACK_END}groups/${groupId}/avatar`;
  };

  return (
    <div className="group-post-detail">
      <div className="group-header">
        <div className="group-cover">
          {selectedImage && (
            <div className="cover-toolbar">
              <div className="option">
                <button className="button cancel" onClick={handleCancel}>
                  {trl("Hủy")}
                </button>
                <button className="button save" onClick={handleSave}>
                  {trl("Lưu thay đổi")}
                </button>
              </div>
            </div>
          )}
          <img
            src={selectedImage || getDefaultOrUploadedAvatar()}
            alt={groupData.group_name}
          />
          <div className="edit-box">
            {!selectedImage && currentUser.id === groupData.created_by && (
              <button className="edit-button" onClick={togglePopover}>
                <FontAwesomeIcon icon={faPen} style={{ marginRight: "5px" }} />
                {trl("Chỉnh sửa")}
              </button>
            )}
            {showPopover && (
              <div className="popover">
                <div className="popover-item">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      cursor: "pointer",
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUpload}
                      style={{ marginRight: "10px" }}
                    />
                    {trl("Tải ảnh lên")}
                  </label>
                </div>
                <div className="popover-item">
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{ marginRight: "10px" }}
                  />
                  {trl("Chọn từ ảnh minh họa")}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="group-info">
          <h1 className="group-name">{groupData.group_name}</h1>
          <p className="group-privacy">
            {groupData.privacy_level === 0 ? (
              <FontAwesomeIcon
                icon={faLock}
                size="xs"
                style={{ marginRight: "5px" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faEarthAmericas}
                size="xs"
                style={{ marginRight: "5px" }}
              />
            )}
            {groupData.privacy_level === 0 ? trl("Nhóm Riêng tư") : trl("Nhóm Công khai")}
            <FontAwesomeIcon
              icon={faCircle}
              style={{ fontSize: "2px", margin: "0 5px" }}
            />
            <span className="member">{members.length + trl(" thành viên")}</span>
          </p>
        </div>
        <div className="group-members">
          <div className="members">
            {members.map((member) => (
              <img
                key={member.id}
                src={`${URL_OF_BACK_END}users/profilePic/${member.id}`}
                alt={member.username}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
              />
            ))}
          </div>
          <div className="invite">
            <span>{trl("+ Mời")}</span>
          </div>
        </div>
        <div className="group-tabs">
          <div className="tab-container">
            <div className={`tab ${activeTab === "discussion" ? "active" : ""}`} onClick={() => handleTabChange("discussion")}>
              <div className="tab-title">
                <span>{trl("Thảo luận")}</span>
              </div>
            </div>
            <div className={`tab ${activeTab === "members" ? "active" : ""}`} onClick={() => handleTabChange("members")}>
              <div className="tab-title">
                <span>{trl("Thành viên")}</span>
              </div>
            </div>
            <div className={`tab ${activeTab === "events" ? "active" : ""}`} onClick={() => handleTabChange("events")}>
              <div className="tab-title">
                <span>{trl("Sự kiện")}</span>
              </div>
            </div>
            <div className={`tab ${activeTab === "files" ? "active" : ""}`} onClick={() => handleTabChange("files")}>
              <div className="tab-title">
                <span>{trl("File")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="group-body">
        <div className="post-block" ref={postRef}>
          {post && <GroupPost post={post} />}
        </div>
        <div className="group-intro">
          <span className="title">{trl("Giới thiệu")}</span>
          {introContent}
        </div>
      </div>
    </div>
  )
};

export default GroupPostDetail;
