import { db } from "../connect.js";

export const getRelationships = (followedUserId, callback) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [followedUserId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (followerUserId, followedUserId, callback) => {
  const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
  const values = [followerUserId, followedUserId];

  db.query(q, [values], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Following");
  });
};

export const deleteRelationship = (followerUserId, followedUserId, callback) => {
  const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

  db.query(q, [followerUserId, followedUserId], (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Unfollow");
  });
};