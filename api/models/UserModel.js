import { db } from "../connect.js";
export const getUserByEmail = (email, callback) => {
  const q = "Select * from users where email=?";
  db.query(q, [email], (err, data) => {
    if (err) return callback(err, null);
    if (!Array.isArray(data)) return callback("Error", null);
    if (data.length === 0) return callback("Can't find your account", null);
    const { password, ...info } = data[0];
    return callback(null, info);
  });
};
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
  const q = `SELECT * FROM users WHERE username LIKE ? OR name LIKE ?`;

  const searchPattern = `%${name}%`; // Tạo mẫu tìm kiếm với ký tự wildcard %

  db.query(q, [searchPattern, searchPattern], (err, data) => {
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

  // Tạo mẫu tìm kiếm với ký tự wildcard %
  const searchPattern = `%${name}%`;

  // Câu truy vấn với phân trang
  const q = `
    SELECT * FROM users 
    WHERE username LIKE ? 
      OR email LIKE ? 
      OR name LIKE ? 
      OR id = ? 
    LIMIT ? 
    OFFSET ?`;

  // Câu truy vấn để lấy tổng số người dùng (để tính số trang)
  const qCount = `
    SELECT COUNT(*) as total 
    FROM users 
    WHERE username LIKE ? 
      OR email LIKE ? 
      OR name LIKE ? 
      OR id = ?`;

  // Thực hiện câu truy vấn để lấy tổng số người dùng
  db.query(
    qCount,
    [searchPattern, searchPattern, searchPattern, name],
    (err, data) => {
      if (err) return callback(err);

      // Tính tổng số trang
      const totalUsers = data[0].total;
      const totalPages = Math.ceil(totalUsers / limit);

      // Thực hiện câu truy vấn với phân trang để lấy người dùng
      db.query(
        q,
        [searchPattern, searchPattern, searchPattern, name, limit, offset],
        (err, data) => {
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
        }
      );
    }
  );
};

export const findAllUsersWithPagination = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  // Câu truy vấn để lấy người dùng với phân trang
  const q = `SELECT * FROM users LIMIT ? OFFSET ?`;

  // Câu truy vấn để lấy tổng số người dùng
  const qCount = `SELECT COUNT(*) as total FROM users`;

  db.query(qCount, (err, data) => {
    if (err) return callback(err);

    // Tính tổng số trang
    const totalUsers = data[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    db.query(q, [limit, offset], (err, data) => {
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
  const q = "UPDATE users SET  `name`=?, `city`=?, `website`=? WHERE id=? ";

  db.query(
    q,
    [userInfo.name, userInfo.city, userInfo.website, userInfo.id],
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
export const updatePasswordEmail = (email, newpassword, callback) => {
  const q = "Update users SET `password`=? Where email=?";
  db.query(q, [newpassword, email], (err, data) => {
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
export const setReputation = (userid, numberReputation, callback) => {
  const q = "update users SET reputation=? where id=?";
  db.query(q, [numberReputation, userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("Not found", null);
  });
};
export const setGenderModel = (userid, gender, callback) => {
  // Kiểm tra giá trị gender

  if (![0, 1, 2].includes(Number(gender))) {
    return callback("Invalid gender value", null);
  }

  const q = "update users SET gender=? where id=?";
  db.query(q, [gender, userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("Not found", null);
  });
};
export const setBirthdateModel = (userid, day, month, year, callback) => {
  // Kiểm tra nếu giá trị day, month, year là null hoặc không xác định
  if (
    day == null ||
    month == null ||
    year == null ||
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year)
  ) {
    return callback("Date values must be non-null and numbers", null);
  }

  // Kiểm tra giá trị tháng và năm hợp lệ
  if (
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    return callback("Invalid date value", null);
  }

  // Kiểm tra giá trị ngày hợp lệ theo tháng và năm
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return callback("Invalid day value for the given month and year", null);
  }

  // Tạo giá trị birthdate theo định dạng YYYY-MM-DD sử dụng UTC
  const birthdate = new Date(Date.UTC(year, month - 1, day))
    .toISOString()
    .slice(0, 10);

  const q = "update users SET birthdate=? where id=?";
  db.query(q, [birthdate, userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("Not found", null);
  });
};
export const setWebsiteModel = (userid, website, callback) => {
  // Kiểm tra nếu giá trị website là null hoặc không hợp lệ
  if (!website || typeof website !== "string") {
    return callback("Invalid website value", null);
  }

  // Tạo query cập nhật giá trị website
  const q = "update users SET website=? where id=?";
  db.query(q, [website, userid], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Updated!");
    return callback("Not found", null);
  });
};
