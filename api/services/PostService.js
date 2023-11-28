import {
  addPost,
  deletePost,
  searchPostsbyContent,
  searchPostsbyHashtag,
  getPostsWithPrivateByUser,
  getPostsWithPrivate,
  updatePost,
  getPostById,
  sharePost,
  updateSharePost,
  addListPostPrivate,
  updatePrivatePost,
  getAllPrivateUserOfPost,
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
export const sharePostService = (userId, post, callback) => {
  const thispost = { desc: post.desc, shareId: post.shareId, userId: userId };
  sharePost(thispost, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const updateSharePostService = (userId, postId, desc, callback) => {
  const thispost = { desc: desc, userId: userId };
  updateSharePost(postId, thispost, (err, data) => {
    if (err) return callback(err, null);
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
    //console.log(updatedPost);
    if (err) return callback(err);
    return callback(null, data);
  });
};
export const getPostByIdService = (userId, postId, callback) => {
  getPostById(userId, postId, (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};
export const updatePrivatePostService = (postId, userId, state, callback) => {
  updatePrivatePost(postId, userId, state, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const addlistPostPrivateService = (
  listUser,
  postId,
  userId,
  callback
) => {
  addListPostPrivate(listUser, postId, userId, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const getlistPostPrivateService = (post_id, user_id, callback) => {
  getAllPrivateUserOfPost(post_id, user_id, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
