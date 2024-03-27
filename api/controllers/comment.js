import { AuthService } from "../services/AuthService.js";
import {
  getCommentsService,
  addCommentWithTokenService,
  deleteCommentWithTokenService,
} from "../services/CommentService.js";

export const getComments = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      const postId = req.query.postId;
      getCommentsService(postId, (err, data) => {
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
  const token = req.cookies.access_token;
  const commentId = req.params.id;
  deleteCommentWithTokenService(token, commentId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
