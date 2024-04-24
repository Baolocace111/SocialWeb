import { db } from "../connect.js";

export const getCommentsByPostId = (postId, callback) => {
  const q = `SELECT c.*, u.id AS userId, name FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [postId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getCommentByCommentId = (commentId, callback) => {
  const q = `SELECT c.*, u.id AS userId, u.name AS userName, post.*, post.postName
  FROM comments AS c 
  LEFT JOIN users AS u ON (u.id = c.userId)
  LEFT JOIN (
      SELECT p.id as postId,
      p.desc as postdesc,
      p.createdAt as postCreatedAt,
      p.status as poststatus,
      p.type as posttype, 
      p.updateAt as postUpdateAt,
      p.userId as uid,
      u2.id AS postUserId, 
      u2.name AS postName
      FROM posts AS p
      LEFT JOIN users AS u2 ON (p.userId = u2.id)
  ) AS post ON (c.postId = post.postId)
  LEFT JOIN users AS u2 ON (post.postUserId = u2.id)
  WHERE c.id = ?;    
  `;
  db.query(q, [commentId], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback(null, null);

    // Chuyển đổi dữ liệu trả về thành cấu trúc mong muốn
    const result = {
      ...data[0],
      post: {
        id: data[0].postId,
        desc: data[0].postdesc,
        createdAt: data[0].postCreatedAt,
        status: data[0].poststatus,
        type: data[0].posttype,
        updateAt: data[0].postUpdateAt,
        userId: data[0].postUserId,
        name: data[0].postName,
      },
    };

    // Loại bỏ các trường không cần thiết
    delete result.postId;
    delete result.postdesc;
    delete result.postCreatedAt;
    delete result.poststatus;
    delete result.posttype;
    delete result.postUpdateAt;
    delete result.postUserId;
    delete result.postName;

    return callback(null, result);
  });
};
export const addComment = (desc, createdAt, userId, postId, callback) => {
  const q =
    "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)";
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
    if (data.affectedRows > 0)
      return callback(null, "Comment has been deleted!");
    return callback("You can delete only your comment!", null);
  });
};
