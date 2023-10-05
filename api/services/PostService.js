import { getPosts, addPost, deletePost } from "../models/PostModel.js";

export const getPostsService = (userId, userInfo, callback) => {
  getPosts(userId, userInfo, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addPostService = (post, callback) => {
  addPost(post, (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};

export const deletePostService = (postId, userId, callback) => {
  deletePost(postId, userId, (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};