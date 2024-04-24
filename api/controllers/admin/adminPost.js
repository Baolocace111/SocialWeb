import { getPostByIdAdminService } from "../../services/AdminService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";

export const getPostByIdAdminController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    getPostByIdAdminService(Number(req.params.id), (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
