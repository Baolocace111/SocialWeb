import { db } from "../connect.js";

export const getCommentsByPostId = (postId, callback) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [postId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addComment = (desc, createdAt, userId, postId, callback) => {
  const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)";
  const values = [desc, createdAt, userId, postId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Comment has been created.");
  });
};

export const deleteComment = (commentId, userId, callback) => {
  const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

  db.query(q, [commentId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Comment has been deleted!");
    return callback("You can delete only your comment!", null);
  });
};