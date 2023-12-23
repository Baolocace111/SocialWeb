import express from "express";
import {
  getStories,
  addStory,
  deleteStory,
  getImageStoryController,
} from "../controllers/story.js";

const router = express.Router();

router.get("/story", getStories);
router.post("/add", addStory);
router.get("/image/:id", getImageStoryController);
//router.delete("/:id", deleteStory);

export default router;
