import {
  createMessage,
  getLatestMessagesWithUsers,
  getMessages,
} from "../models/MessageModel.js";
import * as userModel from "../models/UserModel.js";
import { clients, sendMessageToUser } from "../index.js";
import { callingUser } from "../routes/call.js";
import { checkFriendshipStatus } from "./FriendshipService.js";
export const sendMessageService = async (
  content,
  userId1,
  userId2,
  callback
) => {
  if ((await checkFriendshipStatus(userId1, userId2)) === 3)
    createMessage(content, userId1, userId2, (err, data) => {
      //console.log(content);
      if (err) return callback(err, null);
      return callback(null, data);
    });
  else return callback("You are not friends", null);
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
export const makeACallService = async (userId, friendId, callback) => {
  if ((await checkFriendshipStatus(userId, friendId)) === 3)
    userModel.getUserById(userId, (error, data) => {
      if (error) return callback(error, null);
      const oppkey = `${userId}to${friendId}`;
      if (callingUser.has(oppkey)) {
        callingUser
          .get(oppkey)
          .send(
            JSON.stringify({ type: "ready", message: "Your friend is ready" })
          );
        return callback(null, {
          type: "ready",
          message: "Your friend is ready",
        });
      }
      if (clients.has("index" + friendId)) {
        sendMessageToUser(
          "index" + friendId,
          JSON.stringify({
            type: "call",
            id: userId,
            name: data.name,
          })
        );
        return callback(null, { type: "call", message: "Đang gọi" });
      } else {
        return callback("Người dùng không online", null);
      }
    });
  else return callback("You are not friends", null);
};
