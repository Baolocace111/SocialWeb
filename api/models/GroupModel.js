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