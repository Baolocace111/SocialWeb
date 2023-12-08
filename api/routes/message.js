import express from "express";
import {
  getLastestMessageController,
  seeMessageController,
  sendMessageController,
} from "../controllers/message.js";

const router = express.Router();

router.post("/send", sendMessageController);
router.post("/", seeMessageController);
router.get("/lastest", getLastestMessageController);

export default router;
