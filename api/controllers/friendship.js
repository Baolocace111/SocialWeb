import { getFriend } from "../models/FriendShipModel.js";
import {
  addRelationshipService,
  deleteRelationshipService,
} from "../services/RelationshipService.js";
import { AuthService } from "../services/AuthService.js";
import {
  checkFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  unfriend,
  cancelFriendRequest,
  rejectFriendRequest,
  getUserFriend,
  getRequestService,
} from "../services/FriendshipService.js";

export const getFriendshipStatus = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    const value = await checkFriendshipStatus(userId, req.params.friendId);
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const sendFriendRequestTo = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = await req.params.friendId;

    const value = await sendFriendRequest(userId, friendId);
    addRelationshipService(userId, friendId, (error, data) => {});
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const acceptFriendRequestFrom = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = await req.params.friendId;

    const value = await acceptFriendRequest(userId, friendId);
    addRelationshipService(userId, friendId, (error, data) => {});
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const unfriendUser = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = await req.params.friendId;

    const value = await unfriend(userId, friendId);
    deleteRelationshipService(userId, friendId, (error, data) => {});
    deleteRelationshipService(friendId, userId, (error, data) => {});
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const cancelRequest = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = await req.params.friendId;

    const value = await cancelFriendRequest(userId, friendId);
    deleteRelationshipService(userId, friendId, (error, data) => {});
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const denyRequest = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = await req.params.friendId;

    const value = await rejectFriendRequest(userId, friendId);
    deleteRelationshipService(friendId, userId, (error, data) => {});
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const listFriendUser = async (req, res) => {
  try {
    const userId = await req.body.user_id;
    getUserFriend(userId, req.body.offset, (error, data) => {
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const RequestFriendController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    getRequestService(userId, req.body.offset, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
