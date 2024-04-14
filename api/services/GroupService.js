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

export const updateGroupAvatarService = (userId, groupId, avatar, callback) => {
    groupModel.checkIfUserIsGroupLeader(userId, groupId, (err, isLeader) => {
        if (err) return callback(err, null);
        if (!isLeader) return callback("Only group leaders can update the group avatar.", null);
        groupModel.updateGroupAvatar(groupId, avatar, (err, data) => {
            if (err) return callback(err, null);
            return callback(null, data);
        });
    });
};

export const getGroupAvatar = (groupId, callback) => {
    groupModel.getGroupAvatarById(groupId, (err, data) => {
        if (err) return callback(err, null);
        if (Array.isArray(data) && data.length > 0) {
            return callback(null, data[0].group_avatar);
        } else {
            return callback(new Error('Avatar not found'), null);
        }
    });
};

export const getGroupsBySearchText = (searchText, userId, callback) => {
    groupModel.searchGroupsBySearchText(searchText, userId, (err, data) => {
        if (err) return callback(err);
        return callback(null, data);
    });
};