import {
  addPost,
  deletePost,
  searchPostsbyContent,
  searchPostsbyHashtag,
  getPostsWithPrivateByUser,
  getPostsWithPrivate,
  updatePost,
} from "../models/PostModel.js";

export const getPostsService = (userId, userInfo, callback) => {
  if (userId !== "undefined") {
    getPostsWithPrivateByUser(userId, userInfo, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  } else {
    getPostsWithPrivate(userInfo, (e, data) => {
      if (e) return callback(e, null);
      return callback(null, data);
    });
  }
  // getPosts(userId, userInfo, (err, data) => {
  //   if (err) return callback(err, null);
  //   return callback(null, data);
  // });
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
export const getPostbyContentService = (content, userId, callback) => {
  searchPostsbyContent(content, userId, (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};
export const getPostbyHashtagService = (hashtag, userId, callback) => {
  searchPostsbyHashtag(hashtag, userId, (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};

export const updatePostService = (postId, updatedPost, callback) => {
  updatePost(postId, updatedPost, (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};

