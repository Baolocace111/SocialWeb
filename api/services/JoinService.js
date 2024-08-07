import * as joinModel from "../models/JoinModel.js";
import { getGroupById } from "../models/GroupModel.js";
import { addNotificationService } from "./NotificationService.js";

export const createJoin = (userId, groupId, callback) => {
   joinModel.createUserJoin(userId, groupId, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, { message: "Joined the group successfully!" });
   });
};

export const deleteJoin = (userId, groupId, callback) => {
   joinModel.deleteUserJoin(userId, groupId, (err, results) => {
      if (err) {
         return callback(err, null);
      }
      return callback(null, results);
   });
};

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
         return callback(
            new Error("Only group leader can view join requests."),
            null
         );
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

      joinModel.checkIfUserIsGroupLeader(
         adminUserId,
         joinRequest.group_id,
         (err, isLeader) => {
            if (err) {
               return callback(err, null);
            }
            if (!isLeader) {
               return callback(
                  new Error("Only group leader can approve request!"),
                  null
               );
            }
            joinModel.approveJoinRequest(joinRequestId, (err, response) => {
               if (err) return callback(err);

               getGroupById(joinRequest.group_id, adminUserId, (err, group) => {
                  if (err || !group) {
                     console.error("Failed to get group info for notification.");
                  } else {
                     addNotificationService(
                        joinRequest.user_id,
                        JSON.stringify({
                           groupname: group[0].group_name,
                           groupId: joinRequest.group_id,
                        }),
                        `/groups/${joinRequest.group_id}`,
                        `groups/${joinRequest.group_id}/avatar`,
                        5,
                        (err, notificationResult) => {
                           if (err) {
                              console.error("Failed to send notification.");
                           }
                        }
                     );
                  }
               });
               return callback(null, response);
            });
         }
      );
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

      joinModel.checkIfUserIsGroupLeader(
         adminUserId,
         joinRequest.group_id,
         (err, isLeader) => {
            if (err) {
               return callback(err, null);
            }
            if (!isLeader) {
               return callback(
                  new Error("Only group leader can reject request!"),
                  null
               );
            }
            joinModel.rejectJoinRequest(joinRequestId, (err, response) => {
               if (err) return callback(err);

               getGroupById(joinRequest.group_id, adminUserId, (err, group) => {
                  if (err || !group) {
                     console.error("Failed to get group info for notification.");
                  } else {
                     addNotificationService(
                        joinRequest.user_id,
                        JSON.stringify({
                           groupname: group[0].group_name,
                           groupId: joinRequest.group_id,
                        }),
                        `/groups/${joinRequest.group_id}`,
                        `groups/${joinRequest.group_id}/avatar`,
                        6,
                        (err, notificationResult) => {
                           if (err) {
                              console.error("Failed to send notification.");
                           }
                        }
                     );
                  }
               });
               return callback(null, response);
            });
         }
      );
   });
};

export const changeGroupLeader = (currentLeaderId, newLeaderId, groupId, callback) => {
   joinModel.checkIfUserIsGroupLeader(currentLeaderId, groupId, (err, isLeader) => {
      if (err) {
         return callback(err, null);
      }
      if (!isLeader) {
         return callback(new Error("Only the current group leader can change the leader!"), null);
      }

      joinModel.checkIfUserIsInGroup(newLeaderId, groupId, (err, isInGroup) => {
         if (err) {
            return callback(err, null);
         }
         if (!isInGroup) {
            return callback(new Error("The new leader must be a member of the group!"), null);
         }

         joinModel.changeGroupLeader(currentLeaderId, newLeaderId, groupId, (err, results) => {
            if (err) return callback(err);
            return callback(null, results);
         });
      });
   });
};

