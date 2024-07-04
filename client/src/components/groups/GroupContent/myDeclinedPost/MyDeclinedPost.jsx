import React, { useState } from "react";
import { useLanguage } from "../../../../context/languageContext";
import "./myDeclinedPost.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PopupWindow from "../../../PopupComponent/PopupWindow";
import PostEdit from "../../../postPopup/editComponent/PostEdit";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../../axios";
import moment from "moment";
import "moment/locale/ja";
import "moment/locale/vi";

const MyDeclinedPost = ({ post }) => {
   const { trl } = useLanguage();
   const queryClient = useQueryClient();
   const [showEditPopup, setShowEditPopup] = useState(false);

   const handleEdit = () => {
      setShowEditPopup(!showEditPopup);
   };

   const deleteMutation = useMutation(
      (postId) => {
         return makeRequest.delete("/posts/" + postId);
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["my-pending-posts"]);
         },
      }
   );

   const handleDelete = () => {
      deleteMutation.mutate(post.id);
   };

   return (
      <div className="my-declined-post">
         <div className="post-info">
            <img
               src={`${URL_OF_BACK_END}users/profilePic/${post.user_id}`}
               onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
               }}
               alt="User"
            />
            <div className="detail">
               <span className="info-name">{post.name}</span>
               <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
         </div>
         <div className="post-content">
            <span className="post-desc">{post.desc}</span>
            <img
               src={URL_OF_BACK_END + `posts/videopost/` + post.id}
               alt=""
            />
         </div>
         <div className="post-action">
            <button className="accept" onClick={handleEdit}>
               {trl("Chỉnh sửa")}
            </button>
            <button className="deny" onClick={handleDelete}>
               {trl("Xóa bài viết")}
            </button>
            <button className="more">
               <MoreHorizIcon fontSize="small" />
            </button>
         </div>

         <PopupWindow handleClose={handleEdit} show={showEditPopup}>
            <PostEdit
               post={post}
               setShowEditPopup={setShowEditPopup}
               showEditPopup={showEditPopup}
            />
         </PopupWindow>
      </div>
   );
};

export default MyDeclinedPost;
