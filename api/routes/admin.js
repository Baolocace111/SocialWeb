import express from "express";
import {
  deletePostAdminController,
  getPostByAdminController,
  getUserPostingAdminController,
} from "../controllers/admin/admin.js";
const router = express.Router();
router.delete("/deletepost", deletePostAdminController);
router.post("/user", getUserPostingAdminController);
router.post("/post", getPostByAdminController);
export default router;
