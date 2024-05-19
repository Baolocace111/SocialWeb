import { db } from "../connect.js";
import moment from "moment";
export const getPostById = (userId, postId, callback) => {
  const q = `SELECT DISTINCT p.*, u.id AS userid, u.name,  f.user_id
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE (p.id=?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC`;
  db.query(q, [userId, postId, userId, userId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0)
      return callback(null, {
        error: true,
        desc: "Bài viết không còn nữa",
        profilePic: "deadskull.png",
        createAt: 0,
      });

    return callback(null, data[0]);
  });
};
export const getPostByIdAdmin = (postid, callback) => {
  const q = `SELECT p.*, u.id AS userid, u.name AS name
  FROM posts p 
  LEFT JOIN users u ON (p.userId = u.id)
  WHERE (p.id = ?);
`;
  db.query(q, [postid], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0)
      return callback(null, {
        error: true,
        desc: "Bài viết không còn nữa",
        profilePic: "deadskull.png",
        createAt: 0,
      });

    return callback(null, data[0]);
  });
};
export const getPosts = (userId, userInfo, callback) => {
  const q =
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT DISTINCT p.*, u.id AS userId, name FROM posts AS p JOIN users 
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
export const getPostsWithPrivateByUserLimit = (
  userId,
  myId,
  offset,
  limit,
  callback
) => {
  const q = `
  SELECT DISTINCT p.*, u.id AS userid, u.name, u.profilePic
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    WHERE (p.type <> 3) AND (p.userId = ?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC limit ? offset ?`;

  db.query(
    q,
    [myId, userId, myId, myId, myId, limit, (offset - 1) * limit],
    (error, results) => {
      if (error) return callback(error, null);
      return callback(null, results);
    }
  );
};

export const getPostsWithPrivateLimit = (userId, offset, limit, callback) => {
  const q = `SELECT DISTINCT p.*, u.id AS userid, u.name, u.profilePic, f.user_id
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE (p.type <> 3) AND (r.followerUserId = ? OR p.userId = ?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC limit ? offset ?`;

  db.query(
    q,
    [
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      limit,
      (offset - 1) * limit,
    ],
    (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    }
  );
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
    "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`,`status`,`type`) VALUES (?)";
  const values = [
    post.desc,
    post.img,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    post.userId,
    post.private,
    0,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been created.");
  });
};
export const addVideoPost = (userId, desc, url, pvt, callback) => {
  const q =
    "INSERT INTO posts(`desc`, `img`, `createdAt`, `type`, `userId`,`status`) VALUES (?)";
  const values = [
    desc,
    url,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    2,
    userId,
    pvt,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Post has been created.");
  });
};
export const getVideoFromPost = (userId, postId, callback) => {
  const q = `SELECT DISTINCT p.*, u.id AS userid, u.name, u.profilePic, f.user_id
    FROM posts p
    LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
    LEFT JOIN users u ON (p.userId = u.id)
    LEFT JOIN relationships r ON (p.userId = r.followedUserId)
    WHERE (p.id=?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC`;
  db.query(q, [userId, postId, userId, userId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback(null, "");

    return callback(null, data[0].img);
  });
};
export const sharePost = (post, callback) => {
  const checkQuery =
    "SELECT * FROM posts WHERE id = ? AND (type = ? OR type = ?)";
  db.query(checkQuery, [post.shareId, 1, 3], (checkErr, checkData) => {
    if (checkErr) {
      return callback(checkErr, null);
    }

    if (checkData.length > 0) {
      return callback("Cannot share a Share post or a Group post", null);
    }

    const insertQuery =
      "INSERT INTO posts(`desc`, `img`, `userId`,`type`) VALUES (?)";
    const values = [post.desc, Number(post.shareId), post.userId, 1];
    db.query(insertQuery, [values], (insertErr, insertData) => {
      if (insertErr) {
        return callback(insertErr, null);
      }
      return callback(null, "Post has been created.");
    });
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
  const sqlQuery = `
  SELECT DISTINCT p.*, u.id as userId, u.name, u.profilePic
  FROM posts p
  LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
  LEFT JOIN users u ON (p.userId = u.id)
  WHERE (p.\`desc\` LIKE ?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC
  `;

  const searchPattern = `%${content}%`; // Tạo mẫu tìm kiếm với ký tự wildcard %

  db.query(
    sqlQuery,
    [userId, searchPattern, userId, userId, userId],
    (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    }
  );
};

export const searchPostsbyHashtag = (hashtag, userId, callback) => {
  const sqlQuery = `
  SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePic
  FROM posts p
  LEFT JOIN friendships f ON (p.userId=f.friend_id AND f.user_id = ? AND f.status = 1)
  LEFT JOIN users u ON (p.userId = u.id)
  WHERE (p.\`desc\` REGEXP ?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC
  `;

  const regexHashtag = `\\b${hashtag}\\b`; // Đảm bảo thoát đúng cách để sử dụng trong REGEXP

  db.query(
    sqlQuery,
    [userId, regexHashtag, userId, userId, userId],
    (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    }
  );
};

export const updatePost = (postId, updatedPost, callback) => {
  const q =
    "UPDATE posts SET `desc` = ?, `img` = ? WHERE id = ? AND userId = ? AND type = 0";
  const values = [
    updatedPost.desc,
    updatedPost.img,
    postId,
    updatedPost.userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    //console.log(values);
    if (data.affectedRows === 0) return callback("Post cant update", null);
    return callback(null, "Post has been updated.");
  });
};
export const updateImagePost = (postId, img, user_id, callback) => {
  const q = "UPDATE posts SET `img` = ? WHERE id = ? AND userId = ?";
  const values = [img, postId, user_id];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows === 0) return callback("Post cant update", null);
    return callback(null, "Post has been updated.");
  });
};
export const updateDescPost = (postId, updatePost, callback) => {
  const q = "UPDATE posts SET `desc` = ? WHERE id = ? AND userId = ?";
  const values = [updatePost.desc, postId, updatePost.userId];
  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows === 0) return callback("Post can`t update", null);
    return callback(null, "Post has been updated.");
  });
};
export const updatePrivatePost = (postId, userId, private_state, callback) => {
  if (![0, 1, 2].includes(private_state))
    return callback("Status invalid", null);
  const q = "Update posts set `status`=? Where id =? AND userId =?";
  const values = [private_state, postId, userId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows === 0) return callback("Post can`t update", null);
    return callback(null, "Updated Successfully");
  });
};
export const addListPostPrivate = (userIDs, postID, userID, callback) => {
  const checkOwnershipQuery = `
    
    SELECT COUNT(*) AS count FROM posts WHERE id = ? AND userId = ?;
    
  `;

  db.query(checkOwnershipQuery, [Number(postID), userID], (error, results) => {
    if (error) {
      return callback(error, null);
    }

    const postBelongsToUser = results[0].count > 0;

    if (!postBelongsToUser) {
      return callback("Người dùng không có quyền thực hiện thay đổi này", null);
    }

    const deleteAndInsertQuery =
      userIDs.length > 0
        ? "" +
          "DELETE FROM post_private WHERE post_id = ?;" +
          "INSERT INTO post_private(`post_id`, `user_id`) VALUES" +
          userIDs.map((id) => `(${Number(postID)}, ${Number(id)})`).join(", ") +
          `;`
        : `DELETE FROM post_private WHERE post_id = ?`;

    db.query(deleteAndInsertQuery, Number(postID), (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results);
    });
  });
};
export const getAllPrivateUserOfPost = (postId, userId, callback) => {
  const query = `
    SELECT users.username, users.id, users.name, users.profilePic
    FROM post_private
    INNER JOIN posts ON post_private.post_id = posts.id
    INNER JOIN users ON post_private.user_id = users.id
    WHERE posts.id = ? AND posts.userId =?
  `;
  db.query(query, [postId, userId], (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};

export const getPostCountPerUserInMonth = (
  year,
  month,
  limit,
  page,
  callback
) => {
  const offset = (page - 1) * limit;
  const q = `
    SELECT u.id, u.username, u.profilePic, u.name, COUNT(p.id) AS total_posts
    FROM users u
    LEFT JOIN posts p ON u.id = p.userId
    WHERE YEAR(p.createdAt) = ? AND MONTH(p.createdAt) = ?
    GROUP BY u.id
    ORDER BY total_posts DESC
    LIMIT ? OFFSET ?;

    SELECT CEIL(COUNT(*) / ?) AS total_pages
    FROM (
      SELECT u.id
      FROM users u
      LEFT JOIN posts p ON u.id = p.userId
      WHERE YEAR(p.createdAt) = ? AND MONTH(p.createdAt) = ?
      GROUP BY u.id
    ) AS user_post_count;
  `;

  const values = [year, month, limit, offset, limit, year, month];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    // Kết quả truy vấn sẽ là mảng chứa hai phần tử: data[0] là thông tin về bài viết của người dùng, data[1] là thông tin về tổng số trang.
    const result = {
      lists: data[0],
      totalPages: data[1].length === 0 ? 0 : data[1][0].total_pages, // Lấy total_pages từ phần tử đầu tiên của mảng data[1]
    };

    return callback(null, result);
  });
};

export const getPostsByUserWithPagination = (
  userId,
  limit,
  year,
  month,
  page,
  callback
) => {
  const offset = (page - 1) * limit;
  const q = `
    SELECT p.*,users.name
    FROM posts p inner join users on p.userId = users.id
    WHERE p.userId = ? AND YEAR(p.createdAt) = ? AND MONTH(p.createdAt) = ?
    ORDER BY p.createdAt DESC
    LIMIT ? OFFSET ?;
  `;

  const values = [userId, year, month, limit, offset];

  db.query(q, values, (err, posts) => {
    if (err) return callback(err, null);

    callback(null, { next: posts.length < limit ? -1 : page + 1, posts });
  });
};
export const deletePostbyAdmin = (postId, callback) => {
  const deleteQuery = `Select posts.* from posts where posts.id=?;
  DELETE posts.* FROM posts WHERE posts.id = ?;`;

  db.query(deleteQuery, [postId, postId], (err, deletedPost) => {
    if (err) return callback(err, null);

    if (deletedPost[1].affectedRows > 0) {
      // Trả về thông tin của bài viết đã bị xóa
      //console.log(deletedPost);
      return callback(null, deletedPost[0]);
    } else {
      return callback("Post is undefined", null);
    }
  });
};
export const deleteImageOfPost = (postId, userId, callback) => {
  const q =
    "UPDATE posts SET img = NULL WHERE `id` = ? AND `userId`=? AND (`desc` IS NOT NULL AND `desc` <>'') ;";
  db.query(q, [postId, userId], (err, deleted) => {
    if (err) return callback(err, null);

    if (deleted.affectedRows > 0) {
      // Trả về thông tin của bài viết đã bị xóa
      //console.log(deletedPost);
      return callback(null, "successfull");
    } else {
      return callback("Post can't delete image", null);
    }
  });
};

export const addGroupPost = (post, callback) => {
  checkGroupMembership(post.userId, post.groupId, (err, isMember) => {
    if (err) return callback(err);
    if (!isMember) return callback("This user is not a member of the group");

    // Kiểm tra xem người dùng có phải là chủ nhóm không
    checkIfUserIsGroupOwner(post.userId, post.groupId, (err, isOwner) => {
      if (err) return callback(err);

      const status = isOwner ? 1 : 0; // Nếu là chủ nhóm thì status = 1, ngược lại status = 0

      // Tiếp tục thêm post như bình thường
      const query =
        "INSERT INTO posts(`desc`, `img`, `userId`, `type`) VALUES (?)";
      const values = [post.desc, post.img, post.userId, post.type];

      db.query(query, [values], (err, postResult) => {
        if (err) return callback(err);

        const postId = postResult.insertId;
        // Thêm status vào query
        const groupPostQuery =
          "INSERT INTO group_posts(`post_id`, `group_id`, `user_id`, `status`) VALUES (?, ?, ?, ?)";
        db.query(
          groupPostQuery,
          [postId, post.groupId, post.userId, status],
          (err, groupPostResult) => {
            if (err) return callback(err);
            return callback(null, "Group post has been created.");
          }
        );
      });
    });
  });
};

export const addGroupVideoPost = (post, callback) => {
  addGroupPost(post, callback);
};

export const getGroupPosts = (groupId, offset, limit, callback) => {
  const sqlOffset = (offset - 1) * limit;
  const q = `
    SELECT posts.*, users.name, users.profilePic 
    FROM posts 
    JOIN users ON posts.userId = users.id
    JOIN group_posts ON posts.id = group_posts.post_id
    WHERE posts.type = 3 AND group_posts.group_id = ? AND group_posts.status = 1
    ORDER BY posts.createdAt DESC 
    LIMIT ? OFFSET ?`;

  db.query(q, [groupId, limit, sqlOffset], (err, results) => {
    if (err) return callback(err);
    return callback(null, results);
  });
};

export const checkGroupMembership = (userId, groupId, callback) => {
  const query = "SELECT status FROM joins WHERE user_id = ? AND group_id = ?";
  db.query(query, [userId, groupId], (err, results) => {
    if (err) return callback(err);
    const isMember = results.length > 0 && results[0].status === 1;
    return callback(null, isMember);
  });
};

export const checkIfUserIsGroupOwner = (userId, groupId, callback) => {
  const query = "SELECT * FROM teams WHERE id = ? AND created_by = ?";
  db.query(query, [groupId, userId], (err, results) => {
    if (err) return callback(err);
    const isOwner = results.length > 0;
    callback(null, isOwner);
  });
};
