import { db } from "../connect.js";

export const createMessage = (content, userId1, userId2, callback) => {
  const q =
    "Insert into messages(sender_id,receiver_id,message,status) VALUES (?,?,?,?)";
  const values = [userId1, userId2, content, 0];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Message has been created");
  });
};
export const createImageMessage = (userId1, userId2, image, callback) => {
  const q =
    "Insert into messages(sender_id,receiver_id,image,status) VALUES (?,?,?,?)";
  const values = [userId1, userId2, image, 0];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Message has been created");
  });
};
export const createReplyMessage = (
  userId1,
  userId2,
  content,
  replyid,
  type,
  callback
) => {
  const q = `INSERT INTO messages (sender_id, receiver_id, ${
    type === 1 ? "image" : "message"
  }, status, replyid) VALUES (?, ?, ?, 0, ?)`;
  const values = [userId1, userId2, content, replyid];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Reply message has been created");
  });
};

export const getImageFromMessageId = (userid, id, callback) => {
  const selectQuery =
    "SELECT * FROM messages WHERE (receiver_id = ? OR sender_id = ?) AND id = ?";
  const values = [userid, userid, id];

  db.query(selectQuery, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback(null, "No message found");
    return callback(null, data[0].image);
  });
};
export const getMessageFromMessageId = (userid, id, callback) => {
  const selectQuery =
    "SELECT * FROM messages WHERE (receiver_id = ? OR sender_id = ?) AND id = ?";
  const values = [userid, userid, id];

  db.query(selectQuery, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.length === 0) return callback(null, "No message found");
    return callback(null, data[0]);
  });
};
export const getMessages = (userId1, userId2, offset, limit, callback) => {
  const selectQuery =
    "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const selectValues = [userId1, userId2, userId2, userId1, limit, offset];

  db.query(selectQuery, selectValues, (err, data) => {
    if (err) return callback(err, null);

    // Lấy IDs của các tin nhắn từ kết quả truy vấn SELECT
    const messageIdsToUpdate = data
      .filter(
        (message) =>
          message.sender_id === userId2 && message.receiver_id === userId1
      )
      .map((message) => message.id);

    // Cập nhật status của các tin nhắn phù hợp thành 1
    const updateQuery = "UPDATE messages SET status = 1 WHERE id IN (?)";
    if (messageIdsToUpdate.length > 0) {
      const updateValues = [messageIdsToUpdate];

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) return callback(updateErr, null);
      });
    }
    return callback(null, data);
  });
};

export const deleteMessage = (messageId, callback) => {
  const q = "DELETE FROM messages WHERE id = ?";
  const values = [messageId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Message has been deleted");
  });
};

export const updateMessage = (messageId, content, callback) => {
  const q = "UPDATE messages SET message = ? WHERE id = ?";
  const values = [content, messageId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Message has been updated");
  });
};
export const evictMessage = (messageId, userid, callback) => {
  const q =
    "UPDATE messages SET message = NULL, image = NULL, isdelete = 1 WHERE id = ? AND sender_id = ?";
  const values = [messageId, userid];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    if (data.affectedRows === 0)
      return callback("No message found or user is not the sender", null);
    return callback(null, "Message has been evicted");
  });
};
export const denyMessage = (messageId, userid, callback) => {
  const q =
    "UPDATE messages SET message = NULL, image = NULL, isdelete = 2 WHERE id = ? AND receiver_id = ?";
  const values = [messageId, userid];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    if (data.affectedRows === 0)
      return callback("No message found or user is not the receiver", null);
    return callback(null, "Message has been evicted");
  });
};
export const deleteAllMessage = (userId1, userId2, callback) => {
  const q =
    "DELETE FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)";
  const values = [userId1, userId2, userId2, userId1];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.affectedRows === 0)
      return callback(null, "No messages found between the users");
    return callback(null, "All messages between the users have been deleted");
  });
};

export const getLatestMessagesWithUsers = (userId, callback) => {
  const query = `
    SELECT 
      m.id AS message_id,
      m.sender_id,
      m.receiver_id,
      m.message,
      m.created_at AS message_created_at,
      m.status,
      u.id AS user_id,
      u.username,
      u.name,
      u.profilePic,
      CASE 
        WHEN m.sender_id = ? THEN true 
        ELSE false 
      END AS isme
    FROM 
      (
        SELECT 
          CASE 
            WHEN sender_id = ? THEN receiver_id 
            ELSE sender_id 
          END AS correspondent_id,
          MAX(created_at) AS latest_message_time
        FROM messages 
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY correspondent_id
      ) AS latest_messages
    INNER JOIN messages AS m ON
      (
        m.sender_id = latest_messages.correspondent_id OR 
        m.receiver_id = latest_messages.correspondent_id
      ) AND
      (
        m.created_at = latest_messages.latest_message_time
      )
    INNER JOIN users AS u ON
      (
        u.id = m.sender_id AND 
        m.receiver_id = ?
      ) OR 
      (
        u.id = m.receiver_id AND 
        m.sender_id = ?
      ) ORDER BY latest_message_time DESC;
  `;
  const values = [userId, userId, userId, userId, userId, userId];

  db.query(query, values, (err, results) => {
    if (err) return callback(err, null);
    let number = 0;
    results.map((mess) => {
      if (mess.isme === 0 && mess.status === 0) {
        number++;
      }
    });
    return callback(null, { number, list: results });
  });
};
