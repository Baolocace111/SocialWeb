import jwt from "jsonwebtoken";
import {
  getStoriesService,
  addStoryService,
  deleteStoryService,
} from "../services/StoryService.js";
import { upload } from "../Multer.js";
import path from "path";
import { AuthService } from "../services/AuthService.js";
import { getStory } from "../models/StoryModel.js";

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;

    getStoriesService(userId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    if (!req.file) return res.status(500).json("image not found");
    upload(req, res, (err) => {
      if (err) return res.status(500).json(err);
      try {
        const absolutePath = path.resolve(req.file.path);
        addStoryService(absolutePath, userId, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        });
      } catch (error) {
        return res.status(500).json(error);
      }
    });
  });
};

export const deleteStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;

    deleteStoryService(req.params.id, userId, (err, data) => {
      if (err) return res.status(500).json(err);
      if (!data) return res.status(403).json("You can delete only your story!");
      return res.status(200).json(data);
    });
  });
};
export const getImageStoryController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    getStory(req.params.id, (error, data) => {
      if (error) return res.status(500).json(error);
      return res.sendFile(data.img);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
