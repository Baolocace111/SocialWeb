import { db } from "../connect.js";
export const getFriend = (userId, pageSize, offset, callback) => {
  const query = `
    SELECT f.*
    FROM friendships f
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
    return callback(null, results);
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
export const createFriendship = (
  userId,
  friendId,
  status,
  callback
) => {
  const query = `
      INSERT INTO friendships (user_id, friend_id, status)
      VALUES (?, ?, ?);
    `;

  // Thực hiện câu truy vấn
  db.query(
    query,
    [userId, friendId, status],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      // Trả về ID của bản ghi vừa tạo
      return callback(null, results.insertId);
    }
  );
};
