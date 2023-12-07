import express from "express";
import {
  RequestFriendController,
  acceptFriendRequestFrom,
  cancelRequest,
  denyRequest,
  getAllFriendsController,
  getCountFriendController,
  getCountRequestController,
  getFriendshipStatus,
  getOnlineFriendController,
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
router.get("/friend/count", getCountFriendController);
router.get("/online", getOnlineFriendController);

export default router;
