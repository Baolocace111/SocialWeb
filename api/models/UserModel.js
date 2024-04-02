import { db } from "../connect.js";

export const getUserById = (userId, callback) => {
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return callback(err);
    if (data.length === 0) return callback("Cant find user", null);
    if (data[0].password) {
      const { password, ...info } = data[0];
      return callback(null, info);
    }
    return callback(null, data[0]);
  });
};
export const findUserByName = (name, callback) => {
  const q = `SELECT * FROM users WHERE username LIKE '%${name}%' OR name LIKE '%${name}%'`;

  db.query(q, (err, data) => {
    if (err) return callback(err);

    let users = data.map((user) => {
      const { password, ...info } = user;
      return info;
    });
    return callback(null, users);
  });
};
export const findUserByNameOEmailOIdOUsername = (
  name,
  page,
  limit,
  callback
) => {
  // Tính chỉ số bắt đầu dựa trên trang hiện tại và giới hạn số mục trên mỗi trang
  const offset = (page - 1) * limit;

  // Câu truy vấn với phân trang
  const q = `SELECT * FROM users WHERE username LIKE '%${name}%' OR email LIKE '%${name}%' OR name LIKE '%${name}%' OR id = ? LIMIT ${limit} OFFSET ${offset}`;

  // Câu truy vấn để lấy tổng số người dùng (để tính số trang)
  const qCount = `SELECT COUNT(*) as total FROM users WHERE username LIKE '%${name}%' OR email LIKE '%${name}%' OR name LIKE '%${name}%' OR id = ?`;

  // Thực hiện câu truy vấn để lấy tổng số người dùng
  db.query(qCount, [name], (err, data) => {
    if (err) return callback(err);

    // Tính tổng số trang
    const totalUsers = data[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    // Thực hiện câu truy vấn với phân trang để lấy người dùng
    db.query(q, [name], (err, data) => {
      if (err) return callback(err);

      let users = data.map((user) => {
        const { password, ...info } = user;
        return info;
      });

      // Trả về kết quả cùng thông tin phân trang
      return callback(null, {
        users,
        currentPage: page,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
      });
    });
  });
};
export const findAllUsersWithPagination = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  // Câu truy vấn để lấy người dùng với phân trang
  const q = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;

  // Câu truy vấn để lấy tổng số người dùng
  const qCount = `SELECT COUNT(*) as total FROM users`;

  db.query(qCount, (err, data) => {
    if (err) return callback(err);

    // Tính tổng số trang
    const totalUsers = data[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    db.query(q, (err, data) => {
      if (err) return callback(err);

      let users = data.map((user) => {
        const { password, ...info } = user;
        return info;
      });

      // Trả về kết quả cùng thông tin phân trang
      return callback(null, {
        users,
        currentPage: page,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
      });
    });
  });
};
export const getUsers = (user_id, offset, callback) => {
  const q = `
  SELECT u.id, u.name, u.username, u.profilePic
  FROM users u
  INNER JOIN friendships f ON u.id = f.friend_id
  WHERE f.user_id IN (
    SELECT friend_id
    FROM friendships
    WHERE user_id = ?
    AND status = 1
  )
  AND u.id NOT IN (
    SELECT friend_id
    FROM friendships
    WHERE user_id = ?
  )
  AND u.id != ?
  AND NOT EXISTS (
    SELECT 1
    FROM friendships
    WHERE (user_id = ? AND friend_id = u.id) OR (user_id = u.id AND friend_id = ?)
  )
  LIMIT 8
  OFFSET ?
`;

  db.query(
    q,
    [user_id, user_id, user_id, user_id, user_id, offset],
    (err, data) => {
      if (err) return callback(err);

      if (data.length < 4) {
        db.query(
          `SELECT id, name, username, profilePic
      FROM users 
      WHERE id NOT IN (
        SELECT DISTINCT friend_id 
        FROM friendships 
        WHERE user_id = ? AND status = 1
      ) AND id NOT IN (?) 
      AND NOT EXISTS (
        SELECT *
        FROM friendships
        WHERE (user_id = ? AND friend_id = users.id) OR (user_id = users.id AND friend_id = ?)
      )
      LIMIT ? OFFSET 0`,
          [
            user_id,
            data.length === 0
              ? [user_id]
              : [...data.map((user) => user.id), user_id],
            user_id,
            user_id,
            4 - data.length,
          ],
          (err, res) => {
            if (err) return callback(err);
            return callback(null, [...data, ...res]);
          }
        );
      } else {
        return callback(null, data);
      }
    }
  );
};

export const getFollowedUsers = (userId, callback) => {
  const q = `
    SELECT users.* 
    FROM users 
    INNER JOIN relationships ON users.id = relationships.followedUserId
    WHERE relationships.followerUserId = ?
  `;

  db.query(q, [userId], (err, data) => {
    if (err) return callback(err);
    return callback(null, data);
  });
};

export const updateUser = (userInfo, callback) => {
  const q =
    "UPDATE users SET `email`=?, `name`=?, `city`=?, `website`=? WHERE id=? ";

  db.query(
    q,
    [
      userInfo.email,
      userInfo.name,
      userInfo.city,
      userInfo.website,
      userInfo.id,
    ],
    (err, data) => {
      if (err) return callback(err);
      if (data.affectedRows > 0) return callback(null, "Updated!");
      return callback("You can update only your profile!");
    }
  );
};
export const updateProfilePic = (userId, profilePic, callback) => {
  const q = "UPDATE users SET `profilePic`=? WHERE id=? ";

  db.query(q, [profilePic, userId], (err, data) => {
    if (err) return callback(err);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("You can update only your profile!");
  });
};
export const updateCoverPic = (userId, coverPic, callback) => {
  const q = "UPDATE users SET `coverPic`=? WHERE id=? ";

  db.query(q, [coverPic, userId], (err, data) => {
    if (err) return callback(err);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("You can update only your profile!");
  });
};
export const updatePasswordUser = (userid, newpassword, callback) => {
  const q = "Update users SET `password`=? Where id=?";
  db.query(q, [newpassword, userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("Wrong password", null);
  });
};
export const getReputation = (userid, callback) => {
  const q = "Select users.reputation from users where id=?";
  db.query(q, [userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback("Cant find user", null);
    return callback(null, data[0]);
  });
};
export const plusReputation = (userid, numberReputation, callback) => {
  const q = "update users SET reputation=reputation+? where id=?";
  db.query(q, [numberReputation, userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("Not found", null);
  });
};
