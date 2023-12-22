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
  addListPostPrivate,
  updatePrivatePost,
  getAllPrivateUserOfPost,
  getPostsWithPrivateByUserLimit,
  getPostsWithPrivateLimit,
  addVideoPost,
  getVideoFromPost,
  updateDescPost,
  deleteImageOfPost,
  updateImagePost,
} from "../models/PostModel.js";

export const getPostsService = (userId, userInfo, offset, callback) => {
  if (userId !== "undefined") {
    if (isNaN(offset))
      getPostsWithPrivateByUser(userId, userInfo, (err, data) => {
        if (err) return callback(err, null);
        return callback(null, data);
      });
    else {
      getPostsWithPrivateByUserLimit(
        userId,
        userInfo,
        offset,
        3,
        (err, data) => {
          if (err) return callback(err, null);
          return callback(null, data);
        }
      );
    }
  } else {
    if (isNaN(offset))
      getPostsWithPrivate(userInfo, (e, data) => {
        if (e) return callback(e, null);
        return callback(null, data);
      });
    else {
      getPostsWithPrivateLimit(userInfo, offset, 3, (err, data) => {
        if (err) return callback(err, null);
        return callback(null, data);
      });
    }
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
export const addVideoPostService = (userId, desc, url, callback) => {
  addVideoPost(userId, desc, url, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const updateDescPostService = (userId, postId, desc, callback) => {
  const thispost = { desc: desc, userId: userId };
  updateDescPost(postId, thispost, (err, data) => {
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
export const updateImagePostService = (postId, userId, img, callback) => {
  updateImagePost(postId, img, userId, (err, data) => {
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
export const getVideoFromPostService = (postId, userId, callback) => {
  getVideoFromPost(userId, postId, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const deleteImagePostService = (postId, userId, callback) => {
  deleteImageOfPost(postId, userId, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
