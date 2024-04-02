import { searchUserByNameEmailIdService } from "../../services/UserService.js";
import {
  ValidateInputAllowNull,
  ValidateInputs,
} from "../../services/ValidateService.js";
import { AuthService } from "../../services/AuthService.js";

export const searchUserBykeyController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);

    await ValidateInputs(Number(req.body.page));

    await ValidateInputAllowNull(req.body.key);
    //console.log("here");
    searchUserByNameEmailIdService(req.body.key, req.body.page, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
