import express from "express";
import {
  login,
  register,
  logout,
  adminLogin,
  checkAdmin,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/admin/login", adminLogin);
router.get("/admin/check", checkAdmin);

export default router;
