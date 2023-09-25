import { db } from "../connect.js";
import moment from "moment";

export const getStories = (userId, callback) => {
  const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) LIMIT 4`;

  db.query(q, [userId], (err, data) => {
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