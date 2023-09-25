import { db } from "../connect.js";
import moment from "moment";

export const getPosts = (userId, userInfo, callback) => {
  const q =
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC`;

  const values =
    userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

  db.query(q, values, (err, data) => {
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