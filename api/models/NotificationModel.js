// Import the database connection from your connect.js file
import { db } from "../connect.js";

// Function to create a new notification
export const createNotification = (userId, message, link, image, callback) => {
  const q =
    "INSERT INTO notifications (userId, message, createdAt, `read`, link, image) VALUES (?, ?, NOW(), ?, ?,?)";
  const values = [userId, message, false, link, image];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Notification has been created");
  });
};
// Function to get paginated notifications for a specific user and mark them as read
export const getAndMarkPaginatedNotifications = (
  userId,
  page,
  pageSize,
  callback
) => {
  const offset = (page - 1) * pageSize;

  const qSelect =
    "SELECT notifications.*, users.id AS userInteractionId, users.profilePic " +
    "FROM notifications " +
    "JOIN users ON users.id = SUBSTRING_INDEX(SUBSTRING_INDEX(notifications.message, '/profile/', -1), '\"', 1) " +
    "WHERE notifications.userId = ? " +
    "ORDER BY createdAt DESC " +
    "LIMIT ?, ?";
  const valuesSelect = [userId, offset, pageSize];

  db.query(qSelect, valuesSelect, (err, notifications) => {
    if (err) return callback(err, null);
    if (notifications.length === 0) return callback(null, []);

    const notificationIds = notifications.map((notification) => notification.id);

    const qUpdate = "UPDATE notifications SET `read` = ? WHERE id IN (?)";
    const valuesUpdate = [true, notificationIds];

    db.query(qUpdate, valuesUpdate, (updateErr, updateResult) => {
      if (updateErr) return callback(updateErr, null);

      // Here, 'notifications' contains paginated notifications with 'read' status updated
      return callback(null, notifications);
    });
  });
};
// Function to delete a notification for a specific user by its ID
export const deleteNotification = (userId, notificationId, callback) => {
  const qDelete = "DELETE FROM notifications WHERE id = ? AND userId = ?";
  const valuesDelete = [notificationId, userId];

  db.query(qDelete, valuesDelete, (err, result) => {
    if (err) return callback(err, null);

    if (result.affectedRows === 0) {
      // If no rows were affected, it means either the notification doesn't exist or the user doesn't have permission
      return callback(
        null,
        "Notification not found or user does not have permission to delete"
      );
    }

    return callback(null, "Notification deleted successfully");
  });
};

// Function to update a notification for a specific user by its ID
export const updateNotificationById = (
  userId,
  notificationId,
  updatedFields,
  callback
) => {
  const { message, link } = updatedFields;

  const qUpdate =
    "UPDATE notifications SET message = ?, link = ? WHERE id = ? AND userId = ?";
  const valuesUpdate = [message, link, notificationId, userId];

  db.query(qUpdate, valuesUpdate, (err, result) => {
    if (err) return callback(err, null);

    if (result.affectedRows === 0) {
      // If no rows were affected, it means either the notification doesn't exist or the user doesn't have permission
      return callback(
        null,
        "Notification not found or user does not have permission to update"
      );
    }

    return callback(null, "Notification updated successfully");
  });
};
// Function to count unread notifications for a specific user
export const countUnreadNotifications = (userId, callback) => {
  const qCount =
    "SELECT COUNT(*) AS unreadCount FROM notifications WHERE userId = ? AND `read` = ?";
  const valuesCount = [userId, false];

  db.query(qCount, valuesCount, (err, result) => {
    if (err) return callback(err, null);

    const unreadCount = result[0].unreadCount; // Extracting the count from the query result
    return callback(null, unreadCount);
  });
};
