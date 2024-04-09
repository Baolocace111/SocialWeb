import express from "express";
import {
  getLastestMessageController,
  makeACallController,
  seeMessageController,
  sendMessageController,
} from "../controllers/message.js";

const router = express.Router();

router.post("/send", sendMessageController);
router.post("/", seeMessageController);
router.get("/lastest", getLastestMessageController);
router.post("/call/:id", makeACallController);

export default router;
