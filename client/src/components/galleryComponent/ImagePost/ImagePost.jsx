import "./imagePost.scss";
import React from "react";
import ReactPlayer from "react-player/lazy";
import { URL_OF_BACK_END } from '../../../axios';

const ImagePost = ({ isLoading, images }) => {
   if (isLoading) return <div>Đang tải...</div>;

   return (
      <div className="image-posts">
         {images.map((post) => (
            <div key={post.id} className="image-post">
               {post.type === 'image' && (
                  <img src={`${URL_OF_BACK_END}posts/videopost/${post.id}`} alt={`Post ${post.id}`} />
               )}
               {post.type === 'video' && (
                  <ReactPlayer
                     key={post.id}
                     url={`${URL_OF_BACK_END}posts/videopost/${post.id}`}
                     className='react-player'
                  />
               )}
            </div>
         ))}
      </div>
   );
};

export default ImagePost;