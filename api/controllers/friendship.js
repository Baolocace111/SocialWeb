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

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      checkFriendshipStatus(userId, req.params.friendId)
        .then((value) => {
          const response = {
            value: value,
          };
          return res.status(200).json(response);
        })
        .catch((error) => {
          throw new Error("Error checking friendship status: " + error.message);
        });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const sendFriendRequestTo = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = req.params.friendId;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
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
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const acceptFriendRequestFrom = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = req.params.friendId;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      const value = await acceptFriendRequest(userId, friendId);
      addRelationshipService(userId, friendId, (error, data) => {});
      const response = {
        value: value,
      };
      return res.status(200).json(response);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const unfriendUser = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = req.params.friendId;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      const value = await unfriend(userId, friendId);
      deleteRelationshipService(userId, friendId, (error, data) => {});
      deleteRelationshipService(friendId, userId, (error, data) => {});
      const response = {
        value: value,
      };
      return res.status(200).json(response);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = req.params.friendId;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
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
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const denyRequest = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = req.params.friendId;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      const value = await rejectFriendRequest(userId, friendId);
      deleteRelationshipService(friendId, userId, (error, data) => {});
      const response = {
        value: value,
      };
      return res.status(200).json(response);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const listFriendUser = async (req, res) => {
  try {
    const userId = await req.body.user_id;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getUserFriend(userId, req.body.offset, (error, data) => {
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const RequestFriendController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getRequestService(userId, req.body.offset, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCountRequestController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getCountRequestService(userId, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllFriendsController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      const targetUserId = req.query.user_id ? req.query.user_id : userId;
      getAllFriendsService(targetUserId, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getCountFriendController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    if (!req.query.user_id) return res.status(500).json("Lost information!!!");

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getCountFriendService(req.query.user_id, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getOnlineFriendController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getAllFriendsService(userId, (error, data) => {
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
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
