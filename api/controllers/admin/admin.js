import { AuthService } from "../../services/AuthService.js";
import {
  deletePostByAdminService,
  getPostByIdAdminService,
  getPostByUserAdminService,
  getUserPostingByAdminService,
} from "../../services/AdminService.js";
import { ValidateInputs } from "../../services/ValidateService.js";
export const getPostByIdAdminController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getUserPostingAdminController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
    getUserPostingByAdminService(
      req.body.year,
      req.body.month,
      req.body.page,
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getPostByAdminController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
    await ValidateInputs(
      Number(req.body.year),
      Number(req.body.month),
      Number(req.body.page),
      Number(req.body.user_id)
    );
    getPostByUserAdminService(
      req.body.year,
      req.body.month,
      req.body.page,
      req.body.user_id,
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const deletePostAdminController = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
    deletePostByAdminService(req.query.postid, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getPostByIdAdmin = async (req, res) => {
  try {
    await AuthService.verifyAdminToken(req.cookies.accessToken);
    getPostByIdAdminService(req.params.id, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
