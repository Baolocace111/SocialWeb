import {
  getFeedbacksService,
  deleteFeedbackService,
  getFeedbacksByStatusService,
} from "../../services/FeedbackService.js";
import { AuthService } from "../../services/AuthService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";
export const getFeedbackController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
    getFeedbacksService(req.params.page, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getFeedbackbyStatusController = async (req, res) => {
  normalBackgroundAdmin(req, res, (err, user_id) => {
    if (err) return res.status(500).json(err);
    getFeedbacksByStatusService(
      req.query.status,
      req.query.page,
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};
export const deleteFeedbackController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
    deleteFeedbackService(req.params.id, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
