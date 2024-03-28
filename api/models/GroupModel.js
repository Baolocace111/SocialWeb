import { db } from "../connect.js";

export const getGroupById = (groupId, callback) => {
    const q = "SELECT * FROM teams WHERE id = ?";

    db.query(q, [groupId], (err, data) => {
        if (err) return callback(err);
        return callback(null, data);
    });
}

export const getGroupsByUserId = (userId, callback) => {
    const q = "SELECT * FROM teams INNER JOIN joins ON teams.id = joins.group_id WHERE joins.user_id=?";

    db.query(q, [userId], (err, data) => {
        if (err) return callback(err);
        return callback(null, data);
    });
}