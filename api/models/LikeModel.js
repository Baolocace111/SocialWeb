import { db } from "../connect.js";

export const getLikesByPostId = (postId, callback) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [postId], (err, data) => {
    if (err) return callback(err, null);
    return callback(
      null,
      data.map((like) => like.userId)
    );
  });
};
export const getLikesByCommentId = (commentId, callback) => {
  const q = "select userId from likes where commentId=?";
  db.query(q, [commentId], (err, data) => {
    if (err) return callback(err, null);
    return callback(
      null,
      data.map((like) => like.userId)
    );
  });
};

export const addLike = (userId, postId, callback) => {
  const q = "INSERT INTO likes (userId, postId) VALUES (?, ?)";
  const values = [userId, postId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been liked.");
  });
};
export const addLikeComment = (userId, commentId, callback) => {
  const q = "INSERT INTO likes (userId,commentId) values (?,?)";
  const values = [userId, commentId];
  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been liked.");
  });
};

export const deleteLike = (userId, postId, callback) => {
  const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";

  db.query(q, [userId, postId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been disliked.");
  });
};
export const deleteLikeComment = (userId, commentId, callback) => {
  const q = "DELETE FROM likes WHERE userId = ? AND commentId = ?";

  db.query(q, [userId, commentId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been disliked.");
  });
};
