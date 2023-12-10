import jwt from "jsonwebtoken";
import {
  getStoriesService,
  addStoryService,
  deleteStoryService,
} from "../services/StoryService.js";

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

    const userId = userInfo.id;
    if (
      req.body.img === "" ||
      req.body.img === undefined ||
      req.body.img === null
    )
      return res.status(500).json("image not found");
    addStoryService(req.body.img, userId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
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
