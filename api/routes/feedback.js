import express from "express";
import {
  addCommentFeedbackController,
  addPostFeedbackController,
} from "../controllers/feedback.js";
const router = express.Router();
router.post("/post", addPostFeedbackController);
router.post("/comment", addCommentFeedbackController);
export default router;
