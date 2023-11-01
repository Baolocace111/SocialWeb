import express  from "express";
import { seeMessageController, sendMessageController } from "../controllers/message.js";

const router=express.Router();

router.post("/send",sendMessageController);
router.post("/",seeMessageController);

export default router;