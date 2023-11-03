import express from "express";
import { acceptFriendRequestFrom, cancelRequest, denyRequest, getFriendshipStatus, listFriendUser, sendFriendRequestTo, unfriendUser } from "../controllers/friendship.js";


const router = express.Router();
router.get("/:friendId",getFriendshipStatus)
router.get("/addfriend/:friendId",sendFriendRequestTo)
router.get("/accept/:friendId",acceptFriendRequestFrom)
router.get("/unfriend/:friendId",unfriendUser)
router.get("/deny/:friendId",denyRequest)
router.get("/cancel/:friendId",cancelRequest)
router.post("/get_friends",listFriendUser)


export default router;