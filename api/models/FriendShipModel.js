import { db } from "../connect.js";
export const getCountRequest = (userId, callback) => {
  const countQuery = `SELECT COUNT(*) AS total FROM friendships f WHERE f.friend_id = ? AND status = 0`;
  //const selectQuery = `SELECT u.* FROM users u INNER JOIN friendships f ON u.id=f.user_id WHERE f.friend_id = ? AND status = 0`;

  db.query(countQuery, [userId], (err, data) => {
    if (err) {
      return callback(err, null);
    }

    return callback(null, data[0].total);
  });
};
export const getRequestFriend = (userId, pageSize, offset, callback) => {
  const countQuery = `SELECT COUNT(*) AS total FROM friendships f WHERE f.friend_id = ? AND status = 0`;
  db.query(countQuery, [userId], (countErr, countRes) => {
    if (countErr) {
      return callback(countErr, null);
    }

    const totalCount = countRes[0].total;

    const selectQuery = `SELECT u.* FROM users u INNER JOIN friendships f ON u.id=f.user_id WHERE f.friend_id = ? AND status = 0 LIMIT ? OFFSET ?`;
    db.query(
      selectQuery,
      [userId, pageSize, offset],
      (selectErr, selectRes) => {
        if (selectErr) {
          return callback(selectErr, null);
        }

        // Xử lý kết quả truy vấn ở đây
        return callback(null, {
          number: totalCount,
          list: selectRes.map((result) => ({
            id: result.id,
            username: result.username,
            name: result.name,
            profilePic: result.profilePic,
          })),
        });
      }
    );
  });
};

export const getFriend = (userId, pageSize, offset, callback) => {
  const query = `
  SELECT u.*
  FROM users u
  INNER JOIN friendships f ON u.id = f.friend_id
  WHERE f.user_id = ?
    AND f.status = 1
  ORDER BY f.intimacy DESC
  LIMIT ?
  OFFSET ?;  
  `;

  // Thực hiện câu truy vấn
  db.query(query, [userId, pageSize, offset], (error, results) => {
    if (error) {
      return callback(error, null);
    }

    // Xử lý kết quả truy vấn ở đây
    return callback(
      null,
      results.map((result) => ({
        id: result.id,
        username: result.username,
        name: result.name,
        profilePic: result.profilePic,
      }))
    );
  });
};
export const getFriendByName = (userId, name, pageSize, offset, callback) => {
  const query = `
      SELECT f.*
      FROM friendships f
      INNER JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = ?
        AND f.status = 1
        AND u.username LIKE ?
      ORDER BY f.intimacy DESC
      LIMIT ?
      OFFSET ?;
    `;

  // Tạo chuỗi tìm kiếm cho tên người dùng
  const searchName = `%${name}%`;

  // Thực hiện câu truy vấn
  db.query(query, [userId, searchName, pageSize, offset], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    // Xử lý kết quả truy vấn ở đây
    return callback(null, results);
  });
};
export const findFriendshipByUserAndFriendAndStatus = async (
  userId1,
  userId2,
  status
) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM friendships
      WHERE user_id = ? AND friend_id = ? AND status = ?;
    `;

    // Thực hiện câu truy vấn
    db.query(query, [userId1, userId2, status], (error, results) => {
      if (error) {
        reject(error);
      }
      // Xử lý kết quả truy vấn ở đây
      resolve(results);
    });
  });
};
export const changeStatusFriendshipByUserAndFriendAndStatus = async (
  userId1,
  userId2,
  currentStatus,
  newStatus
) => {
  return new Promise((resolve, reject) => {
    const updateQuery = `
      UPDATE friendships
      SET status = ?
      WHERE user_id = ? AND friend_id = ? AND status = ?;
    `;

    // Execute the update query
    db.query(
      updateQuery,
      [newStatus, userId1, userId2, currentStatus],
      (error, results) => {
        if (error) {
          reject(error);
        }
        // Handle the query results here
        resolve(results);
      }
    );
  });
};
export const createFriendship = async (userId, friendId, status) => {
  try {
    const query = `
      INSERT INTO friendships (user_id, friend_id, status)
      VALUES (?, ?, ?);
    `;

    // Thực hiện câu truy vấn
    const results = await db.query(query, [userId, friendId, status]);

    // Trả về ID của bản ghi vừa tạo
    return results.insertId;
  } catch (error) {
    return error;
  }
};
export const deleteFriendship = async (userId, friendId) => {
  try {
    const query = `
      DELETE FROM friendships
      WHERE (user_id = ? AND friend_id = ? )
      OR (user_id = ? AND friend_id = ? );
    `;

    // Execute the deletion query
    const results = await db.query(query, [userId, friendId, friendId, userId]);

    // Return the number of affected rows
    return results.affectedRows;
  } catch (error) {
    return error;
  }
};

export const deleteFriendshipByStatus = async (userId, friendId, status) => {
  try {
    const query = `
      DELETE FROM friendships
      WHERE (user_id = ? AND friend_id = ? AND status = ?)
      OR (user_id = ? AND friend_id = ? AND status = ?);
    `;

    // Execute the deletion query
    const results = await db.query(query, [
      userId,
      friendId,
      status,
      friendId,
      userId,
      status,
    ]);

    // Return the number of affected rows
    return results.affectedRows;
  } catch (error) {
    return error;
  }
};
export const getAllFriends = (user_id, callback) => {
  const query = `SELECT u.username, u.id, u.name, u.profilePic
FROM users u
INNER JOIN friendships f ON u.id = f.friend_id
WHERE f.user_id = ?
  AND f.status = 1
ORDER BY f.intimacy DESC`;
  db.query(query, [user_id], (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const getCountFriend = (user_id, callback) => {
  const query = `Select COUNT(*) AS total FROM users u
  INNER JOIN friendships f ON u.id = f.friend_id
  WHERE f.user_id = ?
    AND f.status = 1`;
  db.query(query, [user_id], (err, data) => {
    if (err) return callback(err, null);
    if (!data[0].total) return callback(null, 0);
    return callback(null, data[0].total);
  });
};
