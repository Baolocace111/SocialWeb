import { db } from "../connect.js";

export const AuthModel = {
  checkIfUserExists(username) {
    return new Promise((resolve, reject) => {
      const q = "SELECT * FROM users WHERE username = ?";

      db.query(q, [username], (err, data) => {
        if (err) reject(err);
        resolve(data.length > 0);
      });
    });
  },

  createUser(username, email, hashedPassword, name) {
    return new Promise((resolve, reject) => {
      const q =
        "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

      const values = [username, email, hashedPassword, name];

      db.query(q, [values], (err, data) => {
        if (err) reject(err);
        resolve();
      });
    });
  },

  getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      const q = "SELECT * FROM users WHERE username = ?";

      db.query(q, [username], (err, data) => {
        if (err) reject(err);
        if (data.length === 0) reject("User is not found");
        resolve(data[0]);
      });
    });
  },
  getUserByid(userid) {
    return new Promise((resolve, reject) => {
      const q = "SELECT * FROM users WHERE id = ?";

      db.query(q, [userid], (err, data) => {
        if (err) reject(err);
        resolve(data[0]);
      });
    });
  },
};
