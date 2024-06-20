import { db } from "../connect.js";
export const getCommentUserById = (userId, commentId, callback) => {
  const q = `
  SELECT c.*, u.id AS userId, u.name
  FROM comments AS c
  JOIN users AS u ON (u.id = c.userId)
  JOIN posts p ON (c.postId = p.id)
  LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
  LEFT JOIN relationships r ON (p.userId = r.followedUserId)
  WHERE c.id = ? 
    AND (p.status = 0 
      OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) 
      OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
  ORDER BY c.createdAt DESC`;

  db.query(q, [userId, commentId, userId, userId, userId], (err, data) => {
    if (err) return callback(err, null);

    if (data.length === 0)
      return callback(null, {
        error: true,
        desc: "Không tìm thấy thông tin của bình luận",
      });

    return callback(null, data[0]);
  });
};
export const getCommentsByCommentId = (userId, postId, commentId, callback) => {
  const q = `
    SELECT DISTINCT c.*, u.id AS userId, u.name
    FROM comments AS c
    JOIN users AS u ON (u.id = c.userId)
    JOIN posts p ON (c.postId = p.id)
    LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE c.postId = ? AND c.commentId = ?
      AND (p.status = 0 
        OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) 
        OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
    ORDER BY c.createdAt DESC`;
  db.query(
    q,
    [userId, postId, commentId, userId, userId, userId],
    (err, data) => {
      if (err) return callback(err, null);

      if (data.length === 0) return callback(null, []);

      return callback(null, data);
    }
  );
};

export const getCommentsByPostId = (userId, postId, callback) => {
  const q = `
    SELECT DISTINCT c.*, u.id AS userId, u.name
    FROM comments AS c
    JOIN users AS u ON (u.id = c.userId)
    JOIN posts p ON (c.postId = p.id)
    LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE c.postId = ? AND c.commentId IS NULL
      AND (p.status = 0 
        OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) 
        OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
    ORDER BY c.createdAt DESC`;

  db.query(q, [userId, postId, userId, userId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback(null, []);

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
    //console.log(data);
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
  const q = `
    INSERT INTO comments (\`desc\`, \`createdAt\`, \`userId\`, \`postId\`)
    SELECT ?, ?, ?, ?
    FROM posts p
    LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE p.id = ?
      AND (p.status = 0 
        OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) 
        OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
    LIMIT 1
  `;

  const values = [
    desc,
    createdAt,
    userId,
    postId,
    userId,
    postId,
    userId,
    userId,
    userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    if (data.affectedRows === 0) {
      return callback(null, {
        error: true,
        desc: "Bạn không có quyền thêm bình luận vào bài viết này hoặc bài viết không tồn tại",
      });
    }

    return callback(null, "Bình luận đã được tạo.");
  });
};
export const addCommentReply = (
  desc,
  createdAt,
  userId,
  postId,
  commentId,
  callback
) => {
  const q = `
    INSERT INTO comments (\`desc\`, \`createdAt\`, \`userId\`, \`postId\`,\`commentId\`)
    SELECT ?, ?, ?, ?,?
    FROM posts p
    LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE p.id = ?
      AND (p.status = 0 
        OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) 
        OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
    LIMIT 1
  `;

  const values = [
    desc,
    createdAt,
    userId,
    postId,
    commentId,
    userId,
    postId,
    userId,
    userId,
    userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    if (data.affectedRows === 0) {
      return callback(null, {
        error: true,
        desc: "Bạn không có quyền thêm bình luận vào bài viết này hoặc bài viết không tồn tại",
      });
    }

    return callback(null, "Bình luận đã được tạo.");
  });
};

// export const addImageComment = (
//   desc,
//   createdAt,
//   userId,
//   postId,
//   image,
//   commentId,
//   callback
// ) => {
//   const q = `
//     INSERT INTO comments (\`desc\`, \`createdAt\`, \`userId\`, \`postId\`, \`image\`, \`commentId\`)
//     SELECT ?, ?, ?, ?, ?, ?
//     FROM posts p
//     LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
//     LEFT JOIN relationships r ON (p.userId = r.followedUserId)
//     WHERE p.id = ?
//       AND (p.status = 0
//         OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL))
//         OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
//     LIMIT 1
//   `;

//   const values = [
//     desc,
//     createdAt,
//     userId,
//     postId,
//     image,
//     commentId,
//     userId,
//     postId,
//     userId,
//     userId,
//     userId,
//   ];

//   db.query(q, values, (err, data) => {
//     console.log("Query executed"); // Thêm log để kiểm tra xem hàm này có được gọi không
//     if (err) {
//       console.log("Error:", err); // In ra lỗi nếu có
//       return callback(err, null);
//     }

//     if (data.affectedRows === 0) {
//       return callback(
//         {
//           error: true,
//           desc: "Bạn không có quyền thêm bình luận vào bài viết này hoặc bài viết không tồn tại",
//         },
//         null
//       );
//     }

//     return callback(null, "Bình luận đã được tạo.");
//   });
// };
export const addImageReplyComment = (
  desc,
  createdAt,
  userId,
  postId,
  image,
  commentId,
  callback
) => {
  const q = `
    INSERT INTO comments (\`desc\`, \`createdAt\`, \`userId\`, \`postId\`, \`image\`,\`commentId\`)
    SELECT ?, ?, ?, ?, ?,?
    FROM posts p
    LEFT JOIN friendships f ON (p.userId = f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE p.id = ?
      AND (p.status = 0 
        OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) 
        OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?))))
    LIMIT 1
  `;

  const values = [
    desc,
    createdAt,
    userId,
    postId,
    image,
    commentId,
    userId,
    postId,
    userId,
    userId,
    userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    if (data.affectedRows === 0) {
      return callback(null, {
        error: true,
        desc: "Bạn không có quyền thêm bình luận vào bài viết này hoặc bài viết không tồn tại",
      });
    }

    return callback(null, "Bình luận đã được tạo.");
  });
};

export const deleteComment = (commentId, userId, callback) => {
  const q = `
    DELETE comments
    FROM comments
    JOIN posts ON comments.postId = posts.id
    WHERE comments.id = ? AND (comments.userId = ? OR posts.userId = ?)
  `;

  db.query(q, [commentId, userId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0)
      return callback(null, "Comment has been deleted!");
    return callback(
      "You can delete only your comment or comments on your posts!",
      null
    );
  });
};

export const deleteCommentByAdmin = (commentId, callback) => {
  const q = `
    START TRANSACTION;
    SELECT * FROM comments WHERE id = ? FOR UPDATE;
    UPDATE users
    SET reputation = reputation - 1
    WHERE id = (SELECT userId FROM comments WHERE id = ?);
    DELETE FROM comments WHERE id = ?;
    COMMIT;
  `;

  db.query(q, [commentId, commentId, commentId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    // Trả về dữ liệu của comment bị xóa
    return callback(null, results[1][0]);
  });
};
