import * as groupModel from "../models/GroupModel.js";

export const getGroupById = (groupId, callback) => {
    groupModel.getGroupById(groupId, (err, data) => {
        if (err) return callback(err, null);
        return callback(null, data);
    });
}

export const getGroups = (userId, callback) => {
    groupModel.getGroupsByUserId(userId, (err, data) => {
        if (err) return callback(err, null);
        return callback(null, data);
    });
}

export const createGroup = (groupName, privacyLevel, createdBy, callback) => {
    groupModel.createGroup(groupName, privacyLevel, createdBy, (err, data) => {
        if (err) return callback(err, null);
        return callback(null, data);
    });
}