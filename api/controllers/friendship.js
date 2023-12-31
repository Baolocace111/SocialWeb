import { getFriend } from "../models/FriendShipModel.js";
import {
  addRelationshipService,
  deleteRelationshipService,
} from "../services/RelationshipService.js";
import { clients } from "../index.js";
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
  getCountRequestService,
  getAllFriendsService,
  getCountFriendService,
} from "../services/FriendshipService.js";
import { sendMessageToUser } from "../index.js";

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
    await addRelationshipService(userId, friendId, (error, data) => {});
    const response = {
      value: value,
    };

    await sendMessageToUser(
      "index" + friendId,
      "A Request has sent or cancelled"
    );
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
    await deleteRelationshipService(userId, friendId, (error, data) => {});
    const response = {
      value: value,
    };
    await sendMessageToUser(
      "index" + friendId,
      "A Request has sent or cancelled"
    );
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
export const getCountRequestController = async (req, res) => {
  const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
  //await console.log("hell");
  getCountRequestService(userId, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    return res.status(200).json(data);
  });
};
export const getAllFriendsController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    if (req.query.user_id) {
      getAllFriendsService(req.query.user_id, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json(data);
      });
    } else
      getAllFriendsService(userId, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getCountFriendController = async (req, res) => {
  try {
    await AuthService.verifyUserToken(req.cookies.accessToken);
    if (!req.query.user_id) return res.status(500).json("Lost information!!!");
    getCountFriendService(req.query.user_id, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getOnlineFriendController = async (req, res) => {
  try {
    const userid = await AuthService.verifyUserToken(req.cookies.accessToken);
    getAllFriendsService(userid, (error, data) => {
      if (error) res.status(500).json(error);
      const resultArray = [];

      for (const item of data) {
        if (clients.has("index" + item.id)) {
          //console.log(clients);
          resultArray.push(item);
        }
      }
      //console.log(clients);
      return res.status(200).json(resultArray);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
