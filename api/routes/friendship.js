import express from "express";
import { getFriendshipStatus } from "../controllers/friendship.js";

const router = express.Router();
router.get("/:friendId",getFriendshipStatus)


export default router;