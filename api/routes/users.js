import express from "express";
import { getUser , updateUser, getFollowedUsers, getUsers,findUserByName } from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.get("/getUsers", getUsers)
router.put("/", updateUser)
router.get("/followed-users/:userId", getFollowedUsers);
router.get("/searchuser/:name",findUserByName);

export default router