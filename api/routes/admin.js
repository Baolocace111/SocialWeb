import express from "express";
import {
  deletePostAdminController,
  getPostByAdminController,
  getUserPostingAdminController,
} from "../controllers/admin/admin.js";
import { searchUserBykeyController } from "../controllers/admin/adminUser.js";
import {
  getFeedbackController,
  getFeedbackImageAdminController,
  getFeedbackbyStatusController,
  handleFeedbackController,
} from "../controllers/admin/adminFeedback.js";
import { getCommentByCommentIdController } from "../controllers/admin/adminComment.js";
import { getPostByIdAdminController } from "../controllers/admin/adminPost.js";
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
//Comment management
router.get("/comment/get/:id", getCommentByCommentIdController);
export default router;
