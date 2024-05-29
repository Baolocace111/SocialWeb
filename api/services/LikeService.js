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
                  JSON.stringify({
                    userId: userInfo.id,
                    postType: post.type,
                    name: data.name,
                  }),
                  post.type === 1
                    ? `/seepost/${post.img}`
                    : `/seepost/${post.id}`,
                  `users/profilePic/${userInfo.id}`,
                  0,
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
