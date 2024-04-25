import express from "express";
import { addPostFeedbackController } from "../controllers/feedback.js";
const router = express.Router();
router.post("/post", addPostFeedbackController);
export default router;
