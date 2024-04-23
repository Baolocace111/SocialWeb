import { upload } from "../Multer.js";
import { AuthService } from "../services/AuthService.js";
import { addPostFeedbackService } from "../services/FeedbackService.js";
import { ValidateInputAllowNull } from "../services/ValidateService.js";
import { uploadBackgroundUser } from "./backgroundController.js";
//export const
export const addPostFeedbackController = async (req, res) => {
  uploadBackgroundUser(req, res, (err, userid, path) => {
    if (err) return res.status(500).json(err);
    ValidateInputAllowNull(req.body.desc, req.rate);
    addPostFeedbackService(
      req.body.desc,
      userid,
      req.body.id,
      req.body.rate,
      path,
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};
