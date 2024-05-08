import React, { useState } from "react";
import { useLanguage } from "../../../../context/languageContext";
import "./myPendingPost.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PopupWindow from "../../../PopupComponent/PopupWindow";
import PostEdit from "../../../postPopup/editComponent/PostEdit";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../../axios";
import moment from "moment";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese

const MyPendingPost = ({ post }) => {
  const { trl } = useLanguage();
  const queryClient = useQueryClient();
  const [showEditPopup, setShowEditPopup] = useState(false);
  // const [postImageUrl, setPostImageUrl] = useState(URL_OF_BACK_END + `posts/videopost/` + post.id);

  const handleEdit = () => {
    setShowEditPopup(!showEditPopup);
  };

  // const handleUpdateImage = (newUrl) => {
  //    // Construct a new URL with timestamp
  //    const updatedUrl = `${newUrl}?timestamp=${new Date().getTime()}`;
  //    setPostImageUrl(updatedUrl);
  //  };

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
    <div className="my-pending-post">
      <div className="post-info">
        <img
          src={`${URL_OF_BACK_END}users/profilePic/${post.user_id}`}
          alt="User"
        />
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
          // onUpdateImage={handleUpdateImage}
        />
      </PopupWindow>
    </div>
  );
};

export default MyPendingPost;
