import { searchUserByNameEmailIdService } from "../../services/UserService.js";
import {
  ValidateInputAllowNull,
  ValidateInputs,
} from "../../services/ValidateService.js";
import { AuthService } from "../../services/AuthService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";
import { changeReputationService } from "../../services/AdminService.js";

export const searchUserBykeyController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);

    await ValidateInputs(Number(req.body.page));

    await ValidateInputAllowNull(req.body.key);

    searchUserByNameEmailIdService(req.body.key, req.body.page, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const ChangeReputationController = (req, res) => {
  normalBackgroundAdmin(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    changeReputationService(req.body.id, req.body.reputation, (error, data) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json(data);
    });
  });
};
