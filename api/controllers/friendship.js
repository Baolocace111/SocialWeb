import { AuthService } from "../services/AuthService.js";
import {
  checkFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  unfriend,
  cancelFriendRequest,
  rejectFriendRequest,
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
    //console.log(friendId);
    const value = sendFriendRequest(userId, friendId);
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
    //console.log(friendId);
    const value = acceptFriendRequest(userId, friendId);
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
    //console.log(friendId);
    const value = unfriend(userId, friendId);
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
    //console.log(friendId);
    const value = cancelFriendRequest(userId, friendId);
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
    //console.log(friendId);
    const value = rejectFriendRequest(userId, friendId);
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
