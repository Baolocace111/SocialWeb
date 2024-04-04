import { db } from "../connect.js";

export const createUserJoin = (userId, groupId, callback) => {
    const q = "INSERT INTO joins (user_id, group_id, joined_date, role) VALUES (?, ?, NOW(), 0)";
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

export const getUsersByGroupId = (groupId, callback) => {
    const q = `
        SELECT u.id, u.username, u.email, u.name, u.coverPic, u.profilePic, j.role
        FROM users u
        INNER JOIN joins j ON u.id = j.user_id
        WHERE j.group_id = ?`;
    db.query(q, [groupId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
    });
}