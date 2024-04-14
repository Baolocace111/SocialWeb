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
        WHERE j.group_id = ? AND j.status = 1`;
    db.query(q, [groupId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
    });
}

export const getJoinRequestsByGroupId = (groupId, callback) => {
    const query = `
        SELECT 
            joins.id, 
            joins.user_id,
            users.name, 
            users.profilePic, 
            users.create_at, 
            joins.joined_date 
        FROM 
            joins 
        INNER JOIN 
            users ON joins.user_id = users.id 
        WHERE 
            joins.group_id = ? AND 
            joins.status = 0
    `;

    db.query(query, [groupId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
    });
};

export const getJoinRequestById = (joinRequestId, callback) => {
    const query = "SELECT * FROM joins WHERE id = ?";
    db.query(query, [joinRequestId], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);
        return callback(null, results[0]);
    });
};

export const approveJoinRequest = (joinRequestId, callback) => {
    const q = "UPDATE joins SET status = 1 WHERE id = ?";
    db.query(q, [joinRequestId], (err, results) => {
        if (err) return callback(err);
        if (results.affectedRows === 0) {
            return callback(new Error("Join request not found or already approved!"));
        }
        return callback(null, results);
    });
};

export const checkIfUserIsGroupLeader = (userId, groupId, callback) => {
    const query = "SELECT * FROM teams WHERE id = ? AND created_by = ?";
    db.query(query, [groupId, userId], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) return callback(null, true);
        return callback(null, false);
    });
};