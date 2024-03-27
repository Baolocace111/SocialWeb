import jwt from "jsonwebtoken";
import {
  getPostsService,
  addPostService,
  deletePostService,
  getPostbyContentService,
  getPostbyHashtagService,
  getPostByIdService,
  sharePostService,
  updateDescPostService,
  updatePrivatePostService,
  addlistPostPrivateService,
  getlistPostPrivateService,
  addVideoPostService,
  getVideoFromPostService,
  deleteImagePostService,
  updateImagePostService,
} from "../services/PostService.js";
import { AuthService } from "../services/AuthService.js";
import { upload } from "../Multer.js";
import path from "path";
import fs from "fs";

export const getPostByIdController = (req, res) => {
  const postId = req.params.postId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const userId = userInfo.id;
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      getPostByIdService(userId, postId, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  });
};

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    AuthService.IsAccountBanned(userInfo.id, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      const offset = Number(req.query.offset);
      //console.log(offset);
      getPostsService(userId, userInfo.id, offset, (err, data) => {
        if (err) return res.status(500).json(err);
        return res
          .status(200)
          .json({ data, next: data.length < 3 ? -1 : offset + 1 });
      });
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    AuthService.IsAccountBanned(userInfo.id, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
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
  });
};
export const sharePostController = async (req, res) => {
  try {
    //await console.log("đã chạy qua");
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      sharePostService(userId, req.body.post, (err, data) => {
        //post bao gồm desc,shareId
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const updateDescPostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    //console.log(req.body.postId, req.body.desc);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      updateDescPostService(
        userId,
        req.body.postId,
        req.body.desc,
        (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        }
      );
    });
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
    AuthService.IsAccountBanned(userInfo.id, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      const userId = userInfo.id;

      deletePostService(postId, userId, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  });
};
export const searchPostsbyContentController = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    AuthService.IsAccountBanned(userInfo.id, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      const userId = userInfo.id;
      getPostbyContentService(req.body.content, userId, (e, data) => {
        if (e) return res.status(500).json(e);
        return res.status(200).json(data);
      });
    });
  });
};
export const searchPostsbyHashtagController = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    AuthService.IsAccountBanned(userInfo.id, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      const userId = userInfo.id;
      getPostbyHashtagService(req.body.hashtag, userId, (e, data) => {
        if (e) return res.status(500).json(e);
        return res.status(200).json(data);
      });
    });
  });
};

export const updateImagePost = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      upload(req, res, (err) => {
        if (err) return res.status(500).json(err);
        if (!req.file) {
          deleteImagePostService(req.params.postId, userId, (error, data) => {
            if (error) return res.status(500).json(error);
            else return res.status(200).json(data);
          });
          return;
        }
        try {
          const absolutePath = path.resolve(req.file.path);
          updateImagePostService(
            req.params.postId,
            userId,
            absolutePath,
            (error, data) => {
              if (error) return res.status(500).json(error);
              return res.status(200).json(data);
            }
          );
        } catch (err) {
          return res.status(500).json(err);
        }
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const updatePrivatePostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      updatePrivatePostService(
        req.params.postId,
        userId,
        req.body.status,
        (error, data) => {
          if (error) return res.status(500).json(error);
          return res.status(200).json(data);
        }
      );
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const addListPostPrivateController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      addlistPostPrivateService(
        req.body.list,
        req.params.postId,
        userId,
        (error, data) => {
          if (error) return res.status(500).json(error);
          return res.status(200).json(data);
        }
      );
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getListPrivatePostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      getlistPostPrivateService(req.params.postId, userId, (error, data) => {
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const addVideoPostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      upload(req, res, (err) => {
        if (err) return res.status(500).json(err);
        if (!req.file) {
          const post = {
            desc: req.body.desc,
            img: "",
            userId: userId,
          };
          if (
            (post.desc === "" ||
              post.desc === undefined ||
              post.desc === null) &&
            (post.img === "" || post.img === undefined || post.img === null)
          )
            return res.status(500).json("Your post is invalid");
          addPostService(post, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
          });
        } else
          try {
            const absolutePath = path.resolve(req.file.path);
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
    });
  } catch (error) {
    //console.log("error authen");
    return res.status(500).json(error);
  }
};
export const getVideoFromPostController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      getVideoFromPostService(req.params.postId, userId, (error, data) => {
        if (error) return res.status(500).json(error);
        if (data === "") return res.status(200).json("");
        if (!data || !fs.existsSync(data))
          return res.status(404).json({ error: "File not found" });
        return res.sendFile(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
