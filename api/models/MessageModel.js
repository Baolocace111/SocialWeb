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
  const q =
    "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) LIMIT ? OFFSET ?";
  const values = [userId1, userId2, userId2, userId1, limit, offset];
  //console.log(values);
  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
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
