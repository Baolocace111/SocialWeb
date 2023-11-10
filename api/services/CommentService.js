import jwt from "jsonwebtoken";
import moment from "moment";
import { getCommentsByPostId, addComment, deleteComment } from "../models/CommentModel.js";

export const getCommentsService = (postId, callback) => {
  getCommentsByPostId(postId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addCommentWithTokenService = (token, desc, postId, callback) => {
  if (!token) return callback("Not logged in!", null);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    addComment(desc, createdAt, userInfo.id, postId, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  });
};

export const deleteCommentWithTokenService = (token, commentId, callback) => {
  if (!token) return callback("Not authenticated!", null);

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    deleteComment(commentId, userInfo.id, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  });
};