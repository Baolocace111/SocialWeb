import {
  findFriendshipByUserAndFriendAndStatus,
  changeStatusFriendshipByUserAndFriendAndStatus,
  createFriendship,
  getFriend,
  getFriendByName,
  deleteFriendship,
  deleteFriendshipByStatus,
} from "../models/FriendShipModel.js";

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
    await deleteFriendship(user_id1,user_id2);
    return true;
  } catch (error) {
    return false;
  }
};
export const cancelFriendRequest = async(user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);
  if (Fstatus !== 1) return false;
  try {
    await deleteFriendship(user_id1,user_id2);
    return true;
  } catch (error) {
    return false;
  }
};
export const rejectFriendRequest = async(user_id1, user_id2) => {
  if (user_id1 === user_id2) {
    return false;
  }

  const Fstatus = await checkFriendshipStatus(user_id1, user_id2);
  if (Fstatus !== 2) return false;
  try {
    await deleteFriendship(user_id1,user_id2);
    return true;
  } catch (error) {
    return false;
  }
};
