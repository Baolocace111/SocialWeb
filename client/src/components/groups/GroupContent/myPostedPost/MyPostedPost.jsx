import React from 'react';
import { useLanguage } from "../../../../context/languageContext";
import "./myPostedPost.scss";
import { URL_OF_BACK_END } from "../../../../axios";
import moment from "moment";
import { useParams } from 'react-router-dom';

const MyPostedPost = ({ post }) => {
   const { trl } = useLanguage();
   const { groupId } = useParams();

   return (
      <div className="my-posted-post">
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
            <button className="deny"
               onClick={() => { window.location.href = `/groups/${groupId}/posts/${post.id}`}}>
               {trl("Xem trong nhóm")}
            </button>
         </div>
      </div>
   );
};

export default MyPostedPost;