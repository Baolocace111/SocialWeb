import express from "express";
import {
  deleteNotificationController,
  getNotificationsController,
  unreadNotificationCountController,
} from "../controllers/notification.js";
const router = express.Router();
router.get("/see/:page", getNotificationsController);
router.get("/count", unreadNotificationCountController);
router.delete("/:id", deleteNotificationController);
export default router;
