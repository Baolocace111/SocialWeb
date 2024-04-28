import React from 'react';
import { useLanguage } from "../../../../context/languageContext";
import "./myPendingPost.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { URL_OF_BACK_END } from "../../../../axios";
import moment from "moment";

const MyPendingPost = ({ post }) => {
   const { trl } = useLanguage();

   return (
      <div className="my-pending-post">
         <div className="post-info">
            <img src={`${URL_OF_BACK_END}users/profilePic/${post.user_id}`} alt="User" />
            <div className="detail">
               <span className="info-name">{post.name}</span>
               <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
         </div>
         <div className="post-content">
            <span className="post-desc">{post.desc}</span>
            <img src={URL_OF_BACK_END + `posts/videopost/` + post.id} alt="" />
         </div>
         <div className="post-action">
            <button className="accept">
               {trl("Chỉnh sửa")}
            </button>
            <button className="deny">
               {trl("Xóa bài viết")}
            </button>
            <button className="more">
               <MoreHorizIcon fontSize="small" />
            </button>
         </div>
      </div>
   );
};

export default MyPendingPost;