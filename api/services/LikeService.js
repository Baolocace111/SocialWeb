import jwt from "jsonwebtoken";
import { getLikesByPostId, addLike, deleteLike } from "../models/LikeModel.js";
import { getPostByIdService } from "./PostService.js";
import { addNotificationService } from "./NotificationService.js";
import { getUserById } from "../models/UserModel.js";
import { SECRET_KEY } from "./AuthService.js";
export const getLikesService = (postId, callback) => {
  getLikesByPostId(postId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addLikeWithTokenService = (token, postId, callback) => {
  if (!token) return callback("Not logged in!", null);

  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    addLike(userInfo.id, postId, (err, data) => {
      if (err) return callback(err, null);

      getPostByIdService(userInfo.id, postId, (err, data) => {
        if (err) return;
        if (data) {
          const post = data;
          if (post.userid !== userInfo.id) {
            getUserById(userInfo.id, (err, data) => {
              if (err) console.log(err);
              else
                addNotificationService(
                  post.userId,
                  `<a target="_blank" href="/profile/${userInfo.id}">${data.name}</a> đã thích bài viết của bạn`,
                  `/seepost/${post.id}`,
                  `/upload/${post.img}`,
                  (err, data) => {
                    if (err) console.log(err);
                  }
                );
            });
          }
        }
      });
      return callback(null, data);
    });
  });
};

export const deleteLikeWithTokenService = (token, postId, callback) => {
  if (!token) return callback("Not logged in!", null);

  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    deleteLike(userInfo.id, postId, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  });
};
