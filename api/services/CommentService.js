import jwt from "jsonwebtoken";
import moment from "moment";
import {
  getCommentsByPostId,
  addComment,
  deleteComment,
  getCommentByCommentId,
  getCommentUserById,
  getCommentsByCommentId,
  addCommentReply,
  addImageReplyComment,
} from "../models/CommentModel.js";
import { SECRET_KEY } from "./AuthService.js";
export const getCommentsService = (userId, postId, callback) => {
  getCommentsByPostId(userId, postId, (err, data) => {
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
export const addReplyCommentService = (
  desc,
  postid,
  commentid,
  userid,
  callback
) => {
  const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  addCommentReply(desc, createdAt, userid, postid, commentid, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const addImageCommentService = (userid, desc, img, postId, callback) => {
  const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  addImageReplyComment(
    desc,
    createdAt,
    userid,
    postId,
    img,
    null,
    (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    }
  );
};
export const addReplyImageCommentService = (
  userID,
  desc,
  img,
  postId,
  commentId,
  callback
) => {
  const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  addImageReplyComment(
    desc,
    createdAt,
    userID,
    postId,
    img,
    commentId,
    (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    }
  );
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
export const getUserImageCommentByIdService = (userid, commentid, callback) => {
  getCommentUserById(userid, commentid, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data.image);
  });
};
export const getAdminImageCommentByIdService = (id, callback) => {
  getCommentByCommentId(id, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data.image);
  });
};
export const getCommentsByCommentIdService = (
  userid,
  commentid,
  postid,
  callback
) => {
  getCommentsByCommentId(userid, postid, commentid, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
