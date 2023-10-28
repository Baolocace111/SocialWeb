import express from "express";
import { acceptFriendRequestFrom, cancelRequest, denyRequest, getFriendshipStatus, sendFriendRequestTo, unfriendUser } from "../controllers/friendship.js";


const router = express.Router();
router.get("/:friendId",getFriendshipStatus)
router.get("/addfriend/:friendId",sendFriendRequestTo)
router.get("/accept/:friendId",acceptFriendRequestFrom)
router.get("/unfriend/:friendId",unfriendUser)
router.get("/deny/:friendId",denyRequest)
router.get("/cancel/:friendId",cancelRequest)


export default router;