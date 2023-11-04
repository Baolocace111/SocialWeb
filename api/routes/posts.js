import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  searchPostsbyContentController,
  searchPostsbyHashtagController,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:postId", deletePost);
router.post("/content", searchPostsbyContentController);
router.post("/hashtag", searchPostsbyHashtagController);
export default router;
