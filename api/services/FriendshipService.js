import { sendMessageToUser } from "../index.js";
import { clients } from "../index.js";
import {
  findFriendshipByUserAndFriendAndStatus,
  changeStatusFriendshipByUserAndFriendAndStatus,
  createFriendship,
  getFriend,
  getFriendByName,
  deleteFriendship,
  getRequestFriend,
  getCountRequest,
  getAllFriends,
  getCountFriend,
} from "../models/FriendShipModel.js";
import { getUserById } from "../models/UserModel.js";
import { addNotificationService } from "./NotificationService.js";

export const getUserFriend = (userId, offset, callback) => {
  getFriend(userId, 10, offset, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getUserFriendByName = (
  userId,
  offset,
  limit,
  callback,
  searchName
) => {
  getFriendByName(userId, searchName, limit, offset, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const checkFriendshipStatus = async (user_id1, user_id2) => {
  if (user_id1 === user_id2) return -1;
  const outgoingRequests = await findFriendshipByUserAndFriendAndStatus(
    user_id1,
    user_id2,
    0
  );
  if (outgoingRequests.length > 0) {
    return 1; // đã gửi lời mời kết bạn
  }

  const incomingRequests = await findFriendshipByUserAndFriendAndStatus(
    user_id2,
    user_id1,
    0
  );
  if (incomingRequests.length > 0) {
    return 2; // đã nhận được lời mời kết bạn
  }

  const friendships = await findFriendshipByUserAndFriendAndStatus(
    user_id1,
    user_id2,
    1
  );
  if (friendships.length > 0) {
    return 3; // đã là bạn bè
  }

  return 0; // chưa là bạn bè
};
export const sendFriendRequest = async (user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);

  if (Fstatus === 1 || Fstatus === 2) {
    return false;
  } else if (Fstatus === 3) {
    return false;
  }

  try {
    await createFriendship(user_id1, user_id2, 0);
    return true;
  } catch (error) {
    //console.error("Error creating friendship:", error);
    return false;
  }
};
export const acceptFriendRequest = async (user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);

  if (Fstatus !== 2) {
    return false;
  }
  try {
    await changeStatusFriendshipByUserAndFriendAndStatus(
      user_id2,
      user_id1,
      0,
      1
    );
    await createFriendship(user_id1, user_id2, 1);
    getUserById(user_id1, (err, data) => {
      if (err) console.log(err);
      else
        addNotificationService(
          user_id2,
          JSON.stringify({
            userId: data.userId,
            name: data.name,
          }),
          `/profile/${user_id1}`,
          `users/profilePic/${user_id1}`,
          1,
          (err, data) => {
            if (err) console.log(err);
          }
        );
    });
    return true;
  } catch (Err) {
    return false;
  }
};
export const unfriend = async (user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);
  if (Fstatus !== 3) return false;
  try {
    await deleteFriendship(user_id1, user_id2);
    return true;
  } catch (error) {
    return false;
  }
};
export const cancelFriendRequest = async (user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);
  if (Fstatus !== 1) return false;
  try {
    await deleteFriendship(user_id1, user_id2);
    return true;
  } catch (error) {
    return false;
  }
};
export const rejectFriendRequest = async (user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);
  if (Fstatus !== 2) return false;
  try {
    await deleteFriendship(user_id1, user_id2);
    return true;
  } catch (error) {
    return false;
  }
};
export const getRequestService = (user_id, offset, callback) => {
  getRequestFriend(user_id, 10, offset, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getCountRequestService = (user_id, callback) => {
  getCountRequest(user_id, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getAllFriendsService = (userId, callback) => {
  getAllFriends(userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getCountFriendService = (userId, callback) => {
  getCountFriend(userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
