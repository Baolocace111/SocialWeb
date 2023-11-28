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
export const getUsers = (callback) => {
  const q = "SELECT * FROM users ORDER BY id DESC LIMIT 5";

  db.query(q, (err, data) => {
    if (err) return callback(err);

    let users = data.map((user) => {
      const { password, ...info } = user;
      return info;
    });
    return callback(null, users);
  });
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
    "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

  db.query(
    q,
    [
      userInfo.name,
      userInfo.city,
      userInfo.website,
      userInfo.profilePic,
      userInfo.coverPic,
      userInfo.id,
    ],
    (err, data) => {
      if (err) return callback(err);
      if (data.affectedRows > 0) return callback(null, "Updated!");
      return callback("You can update only your post!");
    }
  );
};
