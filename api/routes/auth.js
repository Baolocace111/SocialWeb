import express from "express";
import {
  login,
  register,
  logout,
  adminLogin,
  checkAdmin,
  checkConnectionController,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/admin/login", adminLogin);
router.get("/admin/check", checkAdmin);
router.get("/check", checkConnectionController);

export default router;
