import express from "express";
import { testupFile } from "../controllers/file.js";
import { upload } from "../Multer.js";
const router = express.Router();
//router.post("/upload", testupFile);
export default router;
