import {
  getLastestMessageofMyFriendService,
  makeACallService,
  seeMessageService,
  sendMessageService,
} from "../services/MessageService.js";
import { AuthService } from "../services/AuthService.js";
import { sendMessageToUser } from "../index.js";

export const sendMessageController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const r_userId = req.body.ruserid;
    const content = req.body.message;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      sendMessageService(content, userId, r_userId, (err, data) => {
        if (err) return res.status(500).json(err);
        sendMessageToUser(r_userId + " chatwith " + userId, "Có tin nhắn mới");
        sendMessageToUser("index" + r_userId, "New message or seen");
        sendMessageToUser("index" + userId, "New message or seen");
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const seeMessageController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const friendId = req.body.friend_id;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      seeMessageService(
        { user_id: userId, friend_id: friendId, offset: req.body.offset },
        (e, data) => {
          if (e) {
            return res.status(500).json(e);
          }
          sendMessageToUser("index" + userId, "New message or seen");
          sendMessageToUser("index" + friendId, "New message or seen");
          return res.status(200).json(data);
        }
      );
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getLastestMessageController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getLastestMessageofMyFriendService(userId, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const makeACallController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      makeACallService(userId, req.params.id, (error, data) => {
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
