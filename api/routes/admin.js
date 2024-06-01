import express from "express";
import {
  deletePostAdminController,
  getPostByAdminController,
  getUserPostingAdminController,
} from "../controllers/admin/admin.js";
import { searchUserBykeyController } from "../controllers/admin/adminUser.js";
import {
  deleteFeedbackController,
  getFeedbackController,
  getFeedbackImageAdminController,
  getFeedbackbyStatusController,
  handleFeedbackController,
} from "../controllers/admin/adminFeedback.js";
import {
  getCommentByCommentIdController,
  getImageCommentByCommentIdController,
} from "../controllers/admin/adminComment.js";
import { getPostByIdAdminController } from "../controllers/admin/adminPost.js";
import {
  deleteFileFromFilePathController,
  findOriginFromFilePathController,
  getFileFromFilePathController,
  getImageFileController,
  getVideoFileController,
} from "../controllers/admin/adminFile.js";
const router = express.Router();
//Post management
router.delete("/deletepost", deletePostAdminController);
router.post("/user", getUserPostingAdminController);
router.get("/post/:id", getPostByIdAdminController);
router.post("/post", getPostByAdminController);
//User management
router.post("/users/getuser", searchUserBykeyController);
//Feedback management
router.get("/feedback/get/:page", getFeedbackController);
router.get("/feedback/getbystatus", getFeedbackbyStatusController);
router.get("/feedback/getimage/:id", getFeedbackImageAdminController);
router.post("/feedback/handle", handleFeedbackController);
router.delete("/feedback/delete/:id", deleteFeedbackController);
//Comment management
router.get("/comment/get/:id", getCommentByCommentIdController);
router.get("/commentimage/get/:id", getImageCommentByCommentIdController);
//File management
router.get("/files/image", getImageFileController);
router.get("/files/video", getVideoFileController);
router.post("/files/origin", findOriginFromFilePathController);
router.get("/files/getImage", getFileFromFilePathController);
router.delete("/files/delete", deleteFileFromFilePathController);
export default router;
