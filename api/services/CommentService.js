import jwt from "jsonwebtoken";
import moment from "moment";
import {
  getCommentsByPostId,
  addComment,
  deleteComment,
  getCommentByCommentId,
} from "../models/CommentModel.js";
import { SECRET_KEY } from "./AuthService.js";
export const getCommentsService = (postId, callback) => {
  getCommentsByPostId(postId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addCommentWithTokenService = (token, desc, postId, callback) => {
  if (!token) return callback("Not logged in!", null);

  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return callback("Token is not valid!", null);

    const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    addComment(desc, createdAt, userInfo.id, postId, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  });
};
export const getCommentByIdService = (commentId, callback) => {
  getCommentByCommentId(commentId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const deleteCommentByUser = (user_id, commentId, callback) => {
  deleteComment(commentId, user_id, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
