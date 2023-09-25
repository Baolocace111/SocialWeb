import jwt from "jsonwebtoken";
import { getLikesByPostId, addLike, deleteLike } from "../models/LikeModel.js";

export const getLikesService = (postId, callback) => {
  getLikesByPostId(postId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addLikeWithTokenService = (token, postId, callback) => {
  if (!token) return callback("Not logged in!", null);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    addLike(userInfo.id, postId, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  });
};

export const deleteLikeWithTokenService = (token, postId, callback) => {
  if (!token) return callback("Not logged in!", null);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    deleteLike(userInfo.id, postId, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  });
};