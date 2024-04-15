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

export const getJoinRequestsByGroupId = (adminUserId, groupId, callback) => {
    joinModel.checkIfUserIsGroupLeader(adminUserId, groupId, (err, isLeader) => {
        if (err) {
            return callback(err, null);
        }
        if (!isLeader) {
            return callback(new Error("Only group leader can view join requests."), null);
        }
        joinModel.getJoinRequestsByGroupId(groupId, callback);
    });
};

export const approveJoinRequest = (adminUserId, joinRequestId, callback) => {
    joinModel.getJoinRequestById(joinRequestId, (err, joinRequest) => {
        if (err) {
            return callback(err, null);
        }
        if (!joinRequest) {
            return callback(new Error("Join request not found!"), null);
        }

        joinModel.checkIfUserIsGroupLeader(adminUserId, joinRequest.group_id, (err, isLeader) => {
            if (err) {
                return callback(err, null);
            }
            if (!isLeader) {
                return callback(new Error("Only group leader can approve request!"), null);
            }
            joinModel.approveJoinRequest(joinRequestId, callback);
        });
    });
};

export const rejectJoinRequest = (adminUserId, joinRequestId, callback) => {
    joinModel.getJoinRequestById(joinRequestId, (err, joinRequest) => {
        if (err) {
            return callback(err, null);
        }
        if (!joinRequest) {
            return callback(new Error("Join request not found!"), null);
        }

        joinModel.checkIfUserIsGroupLeader(adminUserId, joinRequest.group_id, (err, isLeader) => {
            if (err) {
                return callback(err, null);
            }
            if (!isLeader) {
                return callback(new Error("Only group leader can reject request!"), null);
            }
            joinModel.rejectJoinRequest(joinRequestId, callback);
        });
    });
};