import { db } from "../connect.js";

export const createUserJoin = (userId, groupId, callback) => {
    const q = "INSERT INTO joins (user_id, group_id) VALUES (?, ?)";
    db.query(q, [userId, groupId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
    });
}

export const deleteUserJoin = (userId, groupId, callback) => {
    const q = "DELETE FROM joins WHERE user_id=? AND group_id=?";
    db.query(q, [userId, groupId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
    });
}