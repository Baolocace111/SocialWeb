import { db } from "../connect.js";

export const getGroupById = (groupId, callback) => {
    const q = "SELECT * FROM teams WHERE id = ?";

    db.query(q, [groupId], (err, data) => {
        if (err) return callback(err);
        return callback(null, data);
    });
}

export const getGroupAvatarById = (groupId, callback) => {
    const q = "SELECT group_avatar FROM teams WHERE id = ?";

    db.query(q, [groupId], (err, data) => {
        if (err) return callback(err);
        if (data.length === 0) return callback(new Error('No avatar found for the provided group ID'));
        return callback(null, data);
    });
};

export const getGroupsByUserId = (userId, callback) => {
    const q = "SELECT * FROM teams INNER JOIN joins ON teams.id = joins.group_id WHERE joins.user_id = ? AND joins.status = 1";

    db.query(q, [userId], (err, data) => {
        if (err) return callback(err);
        return callback(null, data);
    });
}

export const createGroup = (groupName, privacyLevel, createdBy, callback) => {
    const q = "INSERT INTO teams(group_name, created_by, creation_at, group_avatar, privacy_level) VALUES (?, ?, NOW(), 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg', ?)";

    db.query(q, [groupName, createdBy, privacyLevel], (err, result) => {
        if (err) return callback(err);

        // Nhận ID của nhóm mới được tạo
        const groupId = result.insertId;

        // Thêm người dùng vào nhóm mới với role là quản trị viên
        const addToJoinsQuery = "INSERT INTO joins(user_id, group_id, joined_date, role) VALUES (?, ?, NOW(), ?)";

        db.query(addToJoinsQuery, [createdBy, groupId, 1], (err, result) => {
            if (err) return callback(err);
            return callback(null, { groupId: groupId, ...result });
        });
    });
}

export const checkIfUserIsGroupLeader = (userId, groupId, callback) => {
    const query = "SELECT * FROM joins WHERE user_id = ? AND group_id = ? AND role = 1";
    db.query(query, [userId, groupId], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) return callback(null, true); // Người dùng là trưởng nhóm
        return callback(null, false); // Người dùng không phải là trưởng nhóm
    });
};
export const updateGroupAvatar = (groupId, avatar, callback) => {
    const q = "UPDATE teams SET `group_avatar`=? WHERE id=? ";

    db.query(q, [avatar, groupId], (err, data) => {
        if (err) return callback(err);
        if (data.affectedRows > 0) return callback(null, "Updated!");
        return callback("You can update only your group!");
    });
};