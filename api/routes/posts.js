import express from "express";
import {
  getPosts,
  deletePost,
  searchPostsbyContentController,
  searchPostsbyHashtagController,
  getPostByIdController,
  sharePostController,
  updateDescPostController,
  updatePrivatePostController,
  addListPostPrivateController,
  getListPrivatePostController,
  addVideoPostController,
  updateImagePost,
  getVideoFromPostController,
} from "../controllers/post.js";

const router = express.Router();
router.post("/share", sharePostController);
router.put("/updatedesc", updateDescPostController);
router.put("/private/:postId", updatePrivatePostController);
router.post("/privatelist/:postId", addListPostPrivateController);
router.post("/private/:postId", getListPrivatePostController);
router.get("/", getPosts);
//router.post("/post", addPost);
router.delete("/:postId", deletePost);
router.post("/content", searchPostsbyContentController);
router.post("/hashtag", searchPostsbyHashtagController);
router.put("/updateimage/:postId", updateImagePost);
router.get("/post/:postId", getPostByIdController);
router.post("/videopost", addVideoPostController);
router.get("/videopost/:postId", getVideoFromPostController);
export default router;
