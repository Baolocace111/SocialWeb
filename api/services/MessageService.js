import {
  createMessage,
  getLatestMessagesWithUsers,
  getMessages,
} from "../models/MessageModel.js";

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
