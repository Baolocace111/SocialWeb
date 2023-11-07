import jwt from "jsonwebtoken";
import {
  getPostsService,
  addPostService,
  deletePostService,
  getPostbyContentService,
  getPostbyHashtagService,
} from "../services/PostService.js";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    getPostsService(userId, userInfo.id, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const post = {
      desc: req.body.desc,
      img: req.body.img,
      userId: userInfo.id,
    };

    addPostService(post, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const deletePost = (req, res) => {
  const postId = req.params.postId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;

    deletePostService(postId, userId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const searchPostsbyContentController = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const userId = userInfo.id;
    getPostbyContentService(req.body.content, userId, (e, data) => {
      if (e) return res.status(500).json(e);
      return res.status(200).json(data);
    });
  });
};
export const searchPostsbyHashtagController = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const userId = userInfo.id;
    getPostbyHashtagService(req.body.hashtag, userId, (e, data) => {
      if (e) return res.status(500).json(e);
      return res.status(200).json(data);
    });
  });
};
