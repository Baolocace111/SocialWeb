import { addNotificationService } from "./NotificationService.js";
import {
  getPostCountPerUserInMonth,
  getPostsByUserWithPagination,
  deletePostbyAdmin,
  getPostById,
  getPostByIdAdmin,
} from "../models/PostModel.js";
import { plusReputation } from "../models/UserModel.js";
export const getUserPostingByAdminService = (year, month, page, callback) => {
  if (Number(year) === NaN || Number(month) === NaN || Number(page) === NaN)
    return callback("Wrong year or month", null);
  getPostCountPerUserInMonth(
    Number(year),
    Number(month),
    10,
    Number(page),
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};
export const getPostByUserAdminService = (
  year,
  month,
  page,
  userId,
  callback
) => {
  if (
    Number(year) === NaN ||
    Number(month) === NaN ||
    Number(page) === NaN ||
    Number(userId) === NaN
  )
    return callback("Wrong year or month", null);
  getPostsByUserWithPagination(
    Number(userId),
    3,
    Number(year),
    Number(month),
    Number(page),
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};
export const deletePostByAdminService = (postId, callback) => {
  deletePostbyAdmin(Number(postId), (err, data) => {
    if (err) return callback(err);

    plusReputation(data[0].userId, -1, (err, infor) => {
      if (err) return callback(err);
      addNotificationService(data[0].userId, "", "", "", 2, (err, data) => {});
      return callback(null, "Delete successfully");
    });
  });
};
export const getPostByIdAdminService = (postId, callback) => {
  getPostByIdAdmin(postId, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
