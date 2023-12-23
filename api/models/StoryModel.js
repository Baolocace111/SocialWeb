import { db } from "../connect.js";
import moment from "moment";

export const getStories = (userId, callback) => {
  const q = `SELECT s.*, u.name
             FROM stories AS s
             JOIN users AS u ON u.id = s.userId
             JOIN relationships AS r ON r.followedUserId = s.userId
             WHERE r.followerUserId = ?
             
             UNION SELECT s.*, u.name
             FROM stories AS s
             JOIN users AS u ON u.id = s.userId
             WHERE s.userId = ?`;

  db.query(q, [userId, userId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addStory = (img, userId, callback) => {
  const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
  const values = [
    img,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    userId,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Story has been created.");
  });
};

export const deleteStory = (storyId, userId, callback) => {
  const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

  db.query(q, [storyId, userId], (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows > 0) return callback(null, "Story has been deleted.");
    return callback("You can delete only your story!", null);
  });
};
export const getStory = (storyId, callback) => {
  const q = "SELECT FROM stories Where `id`=?;";
  db.query(q, [storyId], (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback("Not found", null);
    return callback(err, data[0]);
  });
};
