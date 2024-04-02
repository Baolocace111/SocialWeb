import express from "express";
import {
  deletePostAdminController,
  getPostByAdminController,
  getUserPostingAdminController,
} from "../controllers/admin/admin.js";
import { searchUserBykeyController } from "../controllers/admin/adminUser.js";
const router = express.Router();
//Post management
router.delete("/deletepost", deletePostAdminController);
router.post("/user", getUserPostingAdminController);
router.post("/post", getPostByAdminController);
//User management
router.post("/users/getuser", searchUserBykeyController);
export default router;
