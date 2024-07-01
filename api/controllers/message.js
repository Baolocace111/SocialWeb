import {
  DeleteAllMessageService,
  EvictOrDenyMessageService,
  getAMessageService,
  getLastestMessageofMyFriendService,
  makeACallService,
  replyMessageService,
  seeMessageService,
  sendImageMessageService,
  sendMessageService,
} from "../services/MessageService.js";
import { AuthService } from "../services/AuthService.js";
import { sendMessageToUser } from "../index.js";
import {
  normalBackgroundUser,
  uploadBackgroundUser,
} from "./backgroundController.js";

export const sendMessageController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    const r_userId = req.body.ruserid;
    const content = req.body.message;
    const replyid = req.body.replyid;

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      if (!replyid) {
        // Nếu tài khoản không bị cấm, tiếp tục xử lý
        sendMessageService(content, userId, r_userId, (err, data) => {
          if (err) return res.status(500).json(err);
          sendMessageToUser(
            r_userId + " chatwith " + userId,
            "Có tin nhắn mới"
          );
          sendMessageToUser("index" + r_userId, "New message or seen");
          sendMessageToUser("index" + userId, "New message or seen");
          return res.status(200).json(data);
        });
      } else {
        replyMessageService(
          content,
          userId,
          r_userId,
          replyid,
          0,
          (err, data) => {
            if (err) return res.status(500).json(err);
            sendMessageToUser(
              r_userId + " chatwith " + userId,
              "Có tin nhắn mới"
            );
            sendMessageToUser("index" + r_userId, "New message or seen");
            sendMessageToUser("index" + userId, "New message or seen");
            return res.status(200).json(data);
          }
        );
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const sendImageMessageController = (req, res) => {
  uploadBackgroundUser(req, res, (error, userid, file) => {
    if (error) return res.status(500).json(error);
    const r_userId = req.body.ruserid;

    const replyid = req.body.replyid;
    if (!replyid) {
      sendImageMessageService(userid, r_userId, file, (err, data) => {
        if (err) return res.status(500).json(err);
        const userId = userid;
        sendMessageToUser(r_userId + " chatwith " + userId, "Có tin nhắn mới");
        sendMessageToUser("index" + r_userId, "New message or seen");
        sendMessageToUser("index" + userId, "New message or seen");
        return res.status(200).json(data);
      });
    } else {
      replyMessageService(file, userid, r_userId, replyid, 1, (err, data) => {
        if (err) return res.status(500).json(err);
        const userId = userid;
        sendMessageToUser(r_userId + " chatwith " + userId, "Có tin nhắn mới");
        sendMessageToUser("index" + r_userId, "New message or seen");
        sendMessageToUser("index" + userId, "New message or seen");
        return res.status(200).json(data);
      });
    }
  });
};
export const getImageMessageController = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    getAMessageService(userid, req.params.id, (error, message) => {
      if (error) return res.status(500).json(error);
      const data = message.image;
      if (data === "") return res.status(500).json("");

      if (!data || !fs.existsSync(data))
        return res.status(404).json({ error: "File not found" });
      return res.sendFile(data);
    });
  });
};
export const getAMessageController = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    getAMessageService(userid, req.params.id, (error, message) => {
      if (error) return res.status(500).json(error);

      return res.status(200).json(message);
    });
  });
};
export const EvictMessageController = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    EvictOrDenyMessageService(userid, req.params.id, 1, (error, message) => {
      if (error) return res.status(500).json(error);

      return res.status(200).json(message);
    });
  });
};
export const DenyMessageController = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    EvictOrDenyMessageService(userid, req.params.id, 2, (error, message) => {
      if (error) return res.status(500).json(error);

      return res.status(200).json(message);
    });
  });
};
export const DeleteAllHistoryMessageController = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    DeleteAllMessageService(userid, req.params.id, (error, message) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json(message);
    });
  });
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
        if (error) {
          //console.log(error);
          return res.status(500).json(error);
        }
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
