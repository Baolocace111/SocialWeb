import { query } from "express";
import { db } from "../connect.js";
import moment from "moment";
export const getPostById = (userId, postId, callback) => {
  const q = `SELECT DISTINCT p.*, u.id AS userid, u.name, u.profilePic, f.user_id
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE (p.id=?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC`;
  db.query(q, [userId, postId, userId, userId, userId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getPosts = (userId, userInfo, callback) => {
  const q =
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT DISTINCT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users 
      AS u ON (u.id = p.userId) 
      LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC`;

  const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getPostsWithPrivateByUser = (userId, myId, callback) => {
  const q = `
  SELECT DISTINCT p.*, u.id AS userid, u.name, u.profilePic
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    WHERE p.userId = ? AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC`;

  db.query(q, [myId, userId, myId, myId, myId], (error, results) => {
    if (error) return callback(error, null);
    return callback(null, results);
  });
};
export const getPostsWithPrivate = (userId, callback) => {
  const q = `SELECT DISTINCT p.*, u.id AS userid, u.name, u.profilePic, f.user_id
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE (r.followerUserId = ? OR p.userId = ?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC`;

  db.query(q, [userId, userId, userId, userId, userId, userId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addPost = (post, callback) => {
  const q =
    "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
  const values = [
    post.desc,
    post.img,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    post.userId,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been created.");
  });
};

export const deletePost = (postId, userId, callback) => {
  const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

  db.query(q, [postId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Post has been deleted.");
    return callback("You can delete only your post.", null);
  });
};
export const searchPostsbyContent = (content, userId, callback) => {
  const tuTimKiem = content;
  const sqlQuery = `
  SELECT DISTINCT p.*, u.id, u.name, u.profilePic
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    WHERE (p.\`desc\` LIKE '%${tuTimKiem}%') AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC
  `;

  db.query(sqlQuery, [userId, userId, userId, userId], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
};
export const searchPostsbyHashtag = (hashtag, userId, callback) => {
  const hashtagh = hashtag;
  //console.log(hashtagh);
  const sqlQuery = `
  SELECT DISTINCT p.*, u.id, u.name, u.profilePic
  FROM posts p
  LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
  LEFT JOIN users u ON (p.userId = u.id)
  WHERE (p.\`desc\` REGEXP '\\\\b${hashtagh}\\\\b') AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC
  `;
  db.query(sqlQuery, [userId, userId, userId, userId], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results);
  });
};

export const updatePost = (postId, updatedPost, callback) => {
  const q =
    "UPDATE posts SET `desc` = ?, `img` = ? WHERE id = ? AND userId = ?";
  const values = [
    updatedPost.desc,
    updatedPost.img,
    postId,
    updatedPost.userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows === 0) return callback("Post cant update", null);
    return callback(null, "Post has been updated.");
  });
};
