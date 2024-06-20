import "./imagePost.scss";
import React from "react";
import ReactPlayer from "react-player/lazy";
import { URL_OF_BACK_END } from "../../../../axios";
import { useLanguage } from "../../../../context/languageContext";

const ImagePost = ({ isLoading, images }) => {
  const { trl } = useLanguage();
  if (isLoading) return <div>{trl("Loading")}...</div>;
  const handleClick = (id) => {
    window.location.href = `/seepost/${id}`;
  };
  return (
    <div className="image-posts">
      {images.map((post) => (
        <div
          key={post.id}
          className="image-post"
          onClick={() => {
            handleClick(post.id);
          }}
        >
          {post.type === "image" && (
            <img
              src={`${URL_OF_BACK_END}posts/videopost/${post.id}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={`Post ${post.id}`}
            />
          )}
          {post.type === "video" && (
            <ReactPlayer
              key={post.id}
              url={`${URL_OF_BACK_END}posts/videopost/${post.id}`}
              className="react-player"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImagePost;
