import { addNotificationService } from "./NotificationService.js";
import {
  getPostCountPerUserInMonth,
  getPostsByUserWithPagination,
  deletePostbyAdmin,
} from "../models/PostModel.js";
export const getUserPostingByAdminService = (year, month, page, callback) => {
  if (Number(year) === NaN || Number(month) === NaN || Number(page) === NaN)
    return callback("Wrong year or month", null);
  getPostCountPerUserInMonth(year, month, 10, page, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
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
  getPostsByUserWithPagination(userId, 3, year, month, page, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const deletePostByAdminService = (postId, callback) => {
  deletePostbyAdmin(postId, (err, data) => {
    if (err) return callback(err);
    addNotificationService(
      data.userId,
      `Bài viết ${data.desc + " "}của bạn vi phạm tiêu chuẩn cộng đồng`,
      "",
      data.img,
      (err, data) => {}
    );
    return callback(null, "Delete successfully");
  });
};
