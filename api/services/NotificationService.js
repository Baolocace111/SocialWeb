import {
  countUnreadNotifications,
  createNotification,
  deleteNotification,
  getAndMarkPaginatedNotifications,
  updateNotificationById,
} from "../models/NotificationModel.js";
import { sendMessageToUser } from "../index.js";
export const addNotificationService = (
  userId,
  message,
  link,
  image,
  callback
) => {
  createNotification(
    userId,
    message ? message : "",
    link,
    image,
    (err, data) => {
      if (err) return callback(err, null);

      sendMessageToUser("index" + userId, "New notification");

      return callback(null, data);
    }
  );
};
export const getNotificationsByUserService = (userId, page, callback) => {
  getAndMarkPaginatedNotifications(userId, page, 10, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const changeNotification = (userId, id, message, link, callback) => {
  updateNotificationById(
    userId,
    id,
    { message: message, link: link },
    (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    }
  );
};
export const deleteNotificationService = (userId, id, callback) => {
  deleteNotification(userId, id, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const unreadNotificationService = (userId, callback) => {
  countUnreadNotifications(userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
