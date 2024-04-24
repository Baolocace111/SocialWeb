import { getCommentByIdService } from "../../services/CommentService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";

export const getCommentByCommentIdController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    getCommentByIdService(Number(req.params.id), (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
