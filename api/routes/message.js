import express from "express";
import {
  DeleteAllHistoryMessageController,
  DenyMessageController,
  EvictMessageController,
  getAMessageController,
  getImageMessageController,
  getLastestMessageController,
  makeACallController,
  seeMessageController,
  sendImageMessageController,
  sendMessageController,
} from "../controllers/message.js";

const router = express.Router();

router.post("/send", sendMessageController);
router.post("/sendimage", sendImageMessageController);
router.post("/", seeMessageController);
router.get("/lastest", getLastestMessageController);
router.get("/image/:id", getImageMessageController);
router.get("/mess/:id", getAMessageController);
router.delete("/evict/:id", EvictMessageController);
router.delete("/deny/:id", DenyMessageController);
router.delete("/deleteall/:id", DeleteAllHistoryMessageController);
router.post("/call/:id", makeACallController);

export default router;
