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
    WHERE p.userId = ? AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC limit ? offset ?`;

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
    WHERE (r.followerUserId = ? OR p.userId = ?) AND (p.status = 0 OR (p.status = 1 AND (p.userId = ? OR f.user_id IS NOT NULL)) OR (p.status = 2 AND (p.userId = ? OR p.id IN (SELECT post_id FROM post_private WHERE user_id = ?)))) ORDER BY p.createdAt DESC limit ? offset ?`;

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
export const sharePost = (post, callback) => {
  const checkQuery = "SELECT * FROM posts WHERE id = ? AND type = ?";
  db.query(checkQuery, [post.shareId, 1], (checkErr, checkData) => {
    if (checkErr) {
      return callback(checkErr, null);
    }

    if (checkData.length > 0) {
      return callback("Cannot share a Share post", null);
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
  const tuTimKiem = content;
  const sqlQuery = `
  SELECT DISTINCT p.*, u.id as userId, u.name, u.profilePic
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
  SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePic
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
export const updateSharePost = (postId, updatePost, callback) => {
  const q =
    "UPDATE posts SET `desc` = ? WHERE id = ? AND userId = ? AND type = 1";
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
          userIDs.map((id) => `(${postID}, ${id})`).join(", ") +
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
