import express from "express";
import { getUser , updateUser, getFollowedUsers, getUsers } from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.get("/getUsers", getUsers)
router.put("/", updateUser)
router.get("/followed-users/:userId", getFollowedUsers);

export default router