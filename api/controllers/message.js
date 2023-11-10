import {
  seeMessageService,
  sendMessageService,
} from "../services/MessageService.js";
import { AuthService } from "../services/AuthService.js";
import { sendMessageToUser } from "../index.js";

export const sendMessageController = async (req, res) => {
  const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
  const r_userId = await req.body.ruserid;
  const content = await req.body.message;
  sendMessageService(content, userId, r_userId, (err, data) => {
    if (err) return res.status(500).json(err);
    sendMessageToUser(r_userId, "Có tin nhắn mới");
    return res.status(200).json(data);
  });
};
export const seeMessageController = async (req, res) => {
  const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

  const page = {
    user_id: userId,
    friend_id: req.body.friend_id,
    offset: req.body.offset,
  };
  seeMessageService(page, (e, data) => {
    if (e) {
      return res.status(500).json(e);
    }
    return res.status(200).json(data);
  });
};
