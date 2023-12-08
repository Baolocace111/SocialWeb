import { db } from "../connect.js";

export const createMessage = (content, userId1, userId2, callback) => {
  const q =
    "Insert into messages(sender_id,receiver_id,message,status) VALUES (?,?,?,?)";
  const values = [userId1, userId2, content, 0];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Message has been create");
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
        //console.log(updateResult);
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
  const q = "UPDATE messages SET content = ? WHERE id = ?";
  const values = [content, messageId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Message has been updated");
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
