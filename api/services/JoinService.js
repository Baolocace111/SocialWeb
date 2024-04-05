import * as joinModel from "../models/JoinModel.js";

export const createJoin = (userId, groupId, callback) => {
    joinModel.createUserJoin(userId, groupId, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, { message: "Joined the group successfully!" });
    });
}

export const deleteJoin = (userId, groupId, callback) => {
    joinModel.deleteUserJoin(userId, groupId, (err, results) => {
        if (err) return callback(err, null);
        return callback(null, { message: "Left the group successfully!" });
    });
}

export const getUsersByGroup = (groupId, callback) => {
    joinModel.getUsersByGroupId(groupId, (err, data) => {
        if (err) return callback(err, null);
        return callback(null, data);
    });
};