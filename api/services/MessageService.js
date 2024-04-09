import {
  createMessage,
  getLatestMessagesWithUsers,
  getMessages,
} from "../models/MessageModel.js";
import * as userModel from "../models/UserModel.js";
import { clients, sendMessageToUser } from "../index.js";
export const sendMessageService = (content, userId1, userId2, callback) => {
  createMessage(content, userId1, userId2, (err, data) => {
    //console.log(content);
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const seeMessageService = (getpage, callback) => {
  const page = getpage;
  getMessages(page.user_id, page.friend_id, page.offset, 10, (e, data) => {
    //console.log(page.user_id+" "+ page.friend_id+" "+ page.offset);
    if (e) return callback(e, null);

    return callback(
      null,
      data.map((message) => {
        let is_yours = true;
        if (message.receiver_id === page.user_id) is_yours = false;
        return {
          id: message.id,
          message: message.message,
          created_at: message.created_at,
          status: message.status,
          is_yours: is_yours,
        };
      })
    );
  });
};
export const getLastestMessageofMyFriendService = (userId, callback) => {
  getLatestMessagesWithUsers(userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const makeACallService = (userId, friendId, callback) => {
  userModel.getUserById(userId, (error, data) => {
    if (error) return callback(error, null);
    if (clients.has("index" + friendId)) {
      sendMessageToUser("index" + friendId, {
        type: "call",
        id: userId,
        name: data.name,
      });
      return callback(null, "Đang gọi");
    } else {
      return callback("Người dùng không online", null);
    }
  });
};
