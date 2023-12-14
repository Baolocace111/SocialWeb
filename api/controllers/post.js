import jwt from "jsonwebtoken";
import {
  getPostsService,
  addPostService,
  deletePostService,
  getPostbyContentService,
  getPostbyHashtagService,
  updatePostService,
  getPostByIdService,
  sharePostService,
  updateSharePostService,
  updatePrivatePostService,
  addlistPostPrivateService,
  getlistPostPrivateService,
  addVideoPostService,
  getVideoFromPostService,
} from "../services/PostService.js";
import { AuthService } from "../services/AuthService.js";
import { upload } from "../Multer.js";
import path from "path";
import fs from 'fs';

export const getPostByIdController = (req, res) => {
  const postId = req.params.postId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const userId = userInfo.id;
    getPostByIdService(userId, postId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const offset = Number(req.query.offset);
    //console.log(offset);
    getPostsService(userId, userInfo.id, offset, (err, data) => {
      if (err) return res.status(500).json(err);
      return res
        .status(200)
        .json({ data, next: data.length < 3 ? -1 : offset + 1 });
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
    if (
      (post.desc === "" || post.desc === undefined || post.desc === null) &&
      (post.img === "" || post.img === undefined || post.img === null)
    )
      return res.status(500).json("Your post is invalid");
    addPostService(post, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const sharePostController = async (req, res) => {
  try {
    //await console.log("đã chạy qua");
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    sharePostService(userId, req.body.post, (err, data) => {
      //post bao gồm desc,shareId
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const updateSharedPostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    //console.log(req.body.postId, req.body.desc);
    updateSharePostService(
      userId,
      req.body.postId,
      req.body.desc,
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
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

export const updatePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.postId; // Lấy ID của bài viết cần sửa từ tham số URL.
    const updatedPost = {
      userId: userInfo.id,
      desc: req.body.desc,
      img: req.body.img,
    };
    if (
      (updatedPost.desc === "" ||
        updatedPost.desc === undefined ||
        updatedPost.desc === null) &&
      (updatedPost.img === "" ||
        updatedPost.img === undefined ||
        updatedPost.img === null)
    )
      return res.status(500).json("Your post is invalid");
    updatePostService(postId, updatedPost, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const updatePrivatePostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    updatePrivatePostService(
      req.params.postId,
      userId,
      req.body.status,
      (error, data) => {
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const addListPostPrivateController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    addlistPostPrivateService(
      req.body.list,
      req.params.postId,
      userId,
      (error, data) => {
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getListPrivatePostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    getlistPostPrivateService(req.params.postId, userId, (error, data) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const addVideoPostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    upload(req, res, (err) => {
      if (err) return res.status(500).json(err);
      if (!req.file) return res.status(500).json("no file");
      try {
        const absolutePath = path.resolve(`..\\api\\` + req.file.path);
        addVideoPostService(
          userId,
          req.body.desc,
          absolutePath,
          (error, data) => {
            if (error) return res.status(500).json(error);
            return res.status(200).json(data);
          }
        );
      } catch (error) {
        console.log("error path");
        return res.status(500).json(error);
      }
    });
  } catch (error) {
    //console.log("error authen");
    return res.status(500).json(error);
  }
};
export const getVideoFromPostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    getVideoFromPostService(req.params.postId, userId, (error, data) => {
      if (error) return res.status(500).json(error);
      if (data === "") return res.status(200).json(error);
      if (!data || !fs.existsSync(data)) return res.status(404).json({ error: "File not found" });
      return res.sendFile(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
