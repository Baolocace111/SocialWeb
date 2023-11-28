import express from "express";
import {
  RequestFriendController,
  acceptFriendRequestFrom,
  cancelRequest,
  denyRequest,
  getAllFriendsController,
  getCountRequestController,
  getFriendshipStatus,
  listFriendUser,
  sendFriendRequestTo,
  unfriendUser,
} from "../controllers/friendship.js";

const router = express.Router();
router.get("/status/:friendId", getFriendshipStatus);
router.get("/addfriend/:friendId", sendFriendRequestTo);
router.get("/accept/:friendId", acceptFriendRequestFrom);
router.get("/unfriend/:friendId", unfriendUser);
router.get("/deny/:friendId", denyRequest);
router.get("/cancel/:friendId", cancelRequest);
router.post("/get_friends", listFriendUser);
router.post("/get_request_friend", RequestFriendController);
router.get("/count", getCountRequestController);
router.get("/allfriend", getAllFriendsController);

export default router;
