import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../../axios.js";
import { AuthContext } from "../../../../context/authContext.js";
import { useLanguage } from "../../../../context/languageContext";
import "./groupLeave.scss";

const GroupLeave = ({ groupId, setShowLeavePopup, showLeavePopup }) => {
   const { trl } = useLanguage();
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedUser, setSelectedUser] = useState(null);
   const { currentUser } = useContext(AuthContext);

   const { data: members, isLoading, error } = useQuery(
      ["group-members", groupId],
      () => makeRequest.get(`/joins/groups/${groupId}/users`).then((res) => res.data)
   );

   const queryClient = useQueryClient();

   const changeLeaderMutation = useMutation(
      (newLeaderId) => {
         return makeRequest.put(`/joins/join/change-leader`, {
            newLeaderId: newLeaderId,
            groupId: groupId,
         });
      },
      {
         onSuccess: () => {
            queryClient.invalidateQueries(["group-members", groupId]);
         },
      }
   );

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

   const handleLeave = async () => {
      if (!selectedUser) {
         alert("Please select a member to assign as the new group leader.");
         return;
      }

      try {
         await changeLeaderMutation.mutateAsync(selectedUser.id);
         await handleLeaveGroup();
         setShowLeavePopup(false);
      } catch (error) {
         console.error("Error while changing group leader:", error);
      }
   };

   const handleCancel = () => {
      setShowLeavePopup(!showLeavePopup);
   };

   const filteredMembers = members?.filter((member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      member.id !== currentUser?.id // Exclude the current user
   );

   if (isLoading) return <div>Loading...</div>;
   if (error) return <div className="error-message">Error: {error.message}</div>;

   return (
      <div className="leave-popup">
         <div className="title">
            <span style={{ fontSize: "22px", fontWeight: "700" }}>
               {trl("Rời nhóm")}
            </span>
         </div>
         <div className="popup-content">
            <p>{trl("Mời một thành viên khác để làm quản trị viên trước khi bạn rời đi nhé.")}</p>
            <input
               type="text"
               placeholder={trl("Chọn quản trị viên mới")}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="search-input"
            />
            {searchTerm && filteredMembers.length > 0 && (
               <div className="member-list">
                  {filteredMembers.map((member) => (
                     <div
                        key={member.id}
                        className="member-item"
                        onClick={() => {
                           setSelectedUser(member);
                           setSearchTerm("");
                        }}
                     >
                        <img
                           src={`${URL_OF_BACK_END}users/profilePic/${member.id}`}
                           alt={member.username}
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/upload/errorImage.png";
                           }}
                        />
                        <span>{member.username}</span>
                     </div>
                  ))}
               </div>
            )}
            {selectedUser && (
               <div className="selected-user">
                  <img
                     src={`${URL_OF_BACK_END}users/profilePic/${selectedUser.id}`}
                     alt={selectedUser.username}
                     onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/upload/errorImage.png";
                     }}
                  />
                  <div className="selected-info">
                     <span className="name">{selectedUser.username}</span>
                     <span>{trl("Quản trị viên đang chờ")}</span>
                  </div>
                  <button className="cancel-select" onClick={() => setSelectedUser(null)}>
                     <span>{trl("Hoàn tác")}</span>
                  </button>
               </div>
            )}
         </div>
         <div className="popup-action">
            <button className="leave" onClick={handleLeave}>
               {trl("Rời nhóm")}
            </button>
            <button className="cancel" onClick={handleCancel}>
               {trl("Hủy")}
            </button>
         </div>
      </div>
   );
};

export default GroupLeave;
