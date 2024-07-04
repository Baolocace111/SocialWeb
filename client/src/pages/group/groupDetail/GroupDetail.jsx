import React, { useState, useContext, useEffect } from "react";
import { useLanguage } from "../../../context/languageContext";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../axios.js";
import { AuthContext } from "../../../context/authContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faCircle, faEye, faLock, faEarthAmericas, faPen, faUpload,
   faImage, faUsersLine, faEllipsis, faCirclePlay, faDoorOpen,
   faAddressCard
} from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import PopupWindow from "../../../components/PopupComponent/PopupWindow.jsx";
import GroupLeave from "./GroupLeave/GroupLeave.jsx";
import GroupShare from "../../../components/groups/GroupShare/GroupShare.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./groupDetail.scss";
import GroupAbout from "../groupAbout/GroupAbout.jsx";
import GroupPosts from "../../../components/groups/GroupPosts/GroupPosts.jsx";

const GroupDetail = () => {
   const { trl } = useLanguage();
   const navigate = useNavigate();
   const { currentUser } = useContext(AuthContext);
   const { groupId } = useParams();
   const [selectedImage, setSelectedImage] = useState(null);
   const [selectedImageFile, setSelectedImageFile] = useState(null);
   const [activeTab, setActiveTab] = useState("discussion");
   const [joinStatus, setJoinStatus] = useState(null);

   const [showPopover, setShowPopover] = useState(false);
   const togglePopover = () => {
      setShowPopover(!showPopover);
   };

   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

   const [showLeavePopup, setShowLeavePopup] = useState(false);
   const handleLeave = () => {
      setShowLeavePopup(!showLeavePopup);
   };

   const {
      data: groupData,
      isLoading: isGroupLoading,
      error: groupError,
   } = useQuery(["group-details", groupId], () =>
      makeRequest.get(`/groups/${groupId}`).then((res) => res.data[0])
   );

   useEffect(() => {
      if (groupData) {
         setJoinStatus(groupData.join_status);
      }
   }, [groupData]);

   const { data: postCounts, isLoading: isLoadingPostCounts } = useQuery(
      ["group-post-counts", groupId],
      () =>
         makeRequest.get(`/groups/${groupId}/post-counts`).then((res) => res.data)
   );

   const {
      data: members,
      isLoading: isMembersLoading,
      error: membersError,
   } = useQuery(["group-members", groupId], () =>
      makeRequest.get(`/joins/groups/${groupId}/users`).then((res) => res.data)
   );

   const handleJoinGroup = async () => {
      try {
         await makeRequest.post("/joins/join", {
            groupId: groupId,
         });
         setJoinStatus(0);
      } catch (error) {
         console.error(
            "Error joining group:",
            error.response ? error.response.data : error.message
         );
      }
   };

   const handleCancelJoinGroup = async () => {
      try {
         const config = {
            data: {
               groupId: groupId,
            }
         };
         await makeRequest.delete("/joins/join", config);
         setJoinStatus(null);
      } catch (error) {
         console.error(
            "Error canceling to join group:",
            error.response ? error.response.data : error.message
         );
      }
   };

   const handleLeaveGroup = async () => {
      try {
         const config = {
            data: {
               groupId: groupId,
            }
         };
         await makeRequest.delete("/joins/join", config);
         window.location.reload();
      } catch (error) {
         console.error(
            "Error canceling to leave group:",
            error.response ? error.response.data : error.message
         );
      }
   };

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

   if (isGroupLoading || isMembersLoading || isLoadingPostCounts)
      return <NineCube />;
   if (groupError)
      return <div className="error-message">Lỗi: {groupError.message}</div>;
   if (membersError)
      return <div className="error-message">Lỗi: {membersError.message}</div>;
   if (
      (!groupData.join_status || groupData.join_status !== 1) &&
      groupData.privacy_level !== 1
   ) {
      return <GroupAbout />;
   }

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
               <FontAwesomeIcon
                  icon={faEye}
                  style={{ marginTop: "4px", marginRight: "-4px" }}
               />
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
               <FontAwesomeIcon
                  icon={faEye}
                  style={{ marginTop: "4px", marginRight: "-4px" }}
               />
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
      <div className="group-detail">
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
                  {groupData.privacy_level === 0
                     ? trl("Nhóm Riêng tư")
                     : trl("Nhóm Công khai")}
                  <FontAwesomeIcon
                     icon={faCircle}
                     style={{ fontSize: "2px", margin: "0 5px" }}
                  />
                  <span className="member">
                     {members.length + trl(" thành viên")}
                  </span>
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
               <div className="activity">
                  {joinStatus === 1 ? (
                     <div className="invite">
                        <span>{trl("+ Mời")}</span>
                     </div>
                  ) : joinStatus === 0 ? (
                     <div className="invite" onClick={handleCancelJoinGroup}>
                        <span>{trl("Hủy yêu cầu")}</span>
                     </div>
                  ) : (
                     <div className="invite" onClick={handleJoinGroup}>
                        <FontAwesomeIcon icon={faUsersLine} />
                        <span>{trl("Tham gia")}</span>
                     </div>
                  )}
               </div>
            </div>
            {postCounts?.pending > 0 && (
               <div className="post-info">
                  <div className="count-posts">
                     <span className="title">{trl("Bài viết đang chờ")}</span>
                     <span className="count">
                        {postCounts.pending + trl(" bài viết")}
                     </span>
                  </div>
                  <div className="post-manage"
                     onClick={() => { window.location.href = `/groups/${groupId}/my-content/pending` }}>
                     <span>{trl("Quản lý bài viết")}</span>
                  </div>
               </div>
            )}
            <div className="group-tabs">
               <div className={postCounts?.pending > 0 ? "tab-container no-border" : "tab-container"}>
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
                  <div className="group-action">
                     <button className="filter-button" onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faEllipsis} />
                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                           {currentUser.id === groupData.created_by ?
                              <>
                                 <div className="option">
                                    <FontAwesomeIcon icon={faCirclePlay} />
                                    <span>{trl("Tạm dừng nhóm")}</span>
                                 </div>
                              </> :
                              <>
                                 <div className="option" onClick={() => navigate(`/groups/${groupId}/my-content/pending`)}>
                                    <FontAwesomeIcon icon={faAddressCard} />
                                    <span>{trl("Nội dung của bạn")}</span>
                                 </div>
                              </>
                           }
                           <hr />
                           <div className="option" onClick={currentUser.id === groupData.created_by ? handleLeave : handleLeaveGroup}>
                              <FontAwesomeIcon icon={faDoorOpen} />
                              <span>{trl("Rời nhóm")}</span>
                           </div>
                        </div>
                     </button>
                  </div>
                  <PopupWindow handleClose={handleLeave} show={showLeavePopup}>
                     <GroupLeave
                        groupId={groupId}
                        setShowLeavePopup={setShowLeavePopup}
                        showLeavePopup={showLeavePopup}
                     />
                  </PopupWindow>
               </div>
            </div>
         </div>
         <div className="group-body">
            <div className="post-block">
               {groupData.join_status === 1 && <GroupShare />}
               <GroupPosts groupId={groupId} />
            </div>
            <div className="group-intro">
               <span className="title">{trl("Giới thiệu")}</span>
               <span className="intro">{groupData.group_intro}</span>
               {introContent}
            </div>
         </div>
      </div>
   );
};

export default GroupDetail;
