import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
  addImageCommentController,
  getImageCommentController,
} from "../controllers/comment.js";

const router = express.Router();

router.get("/comment", getComments);
router.post("/addComment", addComment);
router.post("/addImageComment", addImageCommentController);
router.get("/image", getImageCommentController);
router.delete("/:id", deleteComment);

export default router;
