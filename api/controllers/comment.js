import { AuthService } from "../services/AuthService.js";
import {
  getCommentsService,
  addCommentWithTokenService,
  deleteCommentByUser,
  addImageCommentService,
  getUserImageCommentByIdService,
} from "../services/CommentService.js";
import {
  normalBackgroundUser,
  uploadBackgroundUser,
} from "./backgroundController.js";

import fs from "fs";
export const getComments = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      const postId = req.query.postId;
      getCommentsService(userId, postId, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    AuthService.IsAccountBanned(userId, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      const token = req.cookies.accessToken;
      const desc = req.body.desc;
      const postId = req.body.postId;

      // Kiểm tra xem bình luận có tồn tại và không chỉ là khoảng trắng
      if (!desc.trim()) {
        return res
          .status(500)
          .json({ error: "Please provide a valid comment" });
      }

      addCommentWithTokenService(token, desc, postId, (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Comment is not valid" });
        }
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteComment = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return req.status(500).json(error);
    deleteCommentByUser(userid, req.params.id, (e, d) => {
      if (e) return res.status(500).json(e);
      return res.status(200).json(d);
    });
  });
};
export const addImageCommentController = (req, res) => {
  uploadBackgroundUser(req, res, (error, userid, filePath) => {
    if (error) return res.status(500).json(error);
    addImageCommentService(
      userid,
      req.body.desc,
      filePath,
      req.body.postId,
      (error, data) => {
        if (error) return res.status(500).json(error);
        return res.status(200).json(data);
      }
    );
  });
};
export const getImageCommentController = (req, res) => {
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);

    getUserImageCommentByIdService(userid, req.query.id, (error, data) => {
      if (error) return res.status(500).json(error);
      if (data === "") return res.status(500).json("");

      if (!data || !fs.existsSync(data))
        return res.status(404).json({ error: "File not found" });
      return res.sendFile(data);
    });
  });
};
