import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  searchPostsbyContentController,
  searchPostsbyHashtagController,
  updatePost,
  getPostByIdController,
  sharePostController,
  updateSharedPostController,
  updatePrivatePostController,
  addListPostPrivateController,
} from "../controllers/post.js";

const router = express.Router();
router.post("/share", sharePostController);
router.put("/share", updateSharedPostController);
router.put("/private/:postId", updatePrivatePostController);
router.post("/privatelist/:postId", addListPostPrivateController);
router.get("/", getPosts);
router.post("/post", addPost);
router.delete("/:postId", deletePost);
router.post("/content", searchPostsbyContentController);
router.post("/hashtag", searchPostsbyHashtagController);
router.put("/update/:postId", updatePost);
router.get("/post/:postId", getPostByIdController);
export default router;
