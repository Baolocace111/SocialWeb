import { upload } from "../Multer.js";
import { AuthService } from "../services/AuthService.js";
import path from "path";
export const uploadBackgroundUser = async (req, res, callback) => {
  try {
    const user_id = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(user_id, async (err, data) => {
      if (err) {
        return callback(err, null, null);
      }
      upload(req, res, (err) => {
        if (err) return callback(err, null, null);
        if (!req.file) {
          return callback(null, user_id, null);
        } else {
          try {
            const absolutePath = path.resolve(req.file.path);
            return callback(null, user_id, absolutePath);
          } catch (e) {
            return callback(e, null, null);
          }
        }
      });
    });
  } catch (error) {
    return callback(error, null, null);
  }
};
export const uploadBackgroundAdmin = async (req, res, callback) => {
  try {
    const user_id = await AuthService.verifyAdminToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(user_id, async (err, data) => {
      if (err) {
        return callback(err, null, null);
      }
      upload(req, res, (err) => {
        if (err) return callback(err, null, null);
        if (!req.file) {
          return callback(null, user_id, null);
        } else {
          try {
            const absolutePath = path.resolve(req.file.path);
            return callback(null, user_id, absolutePath);
          } catch (e) {
            return callback(e, null, null);
          }
        }
      });
    });
  } catch (error) {
    return callback(error, null, null);
  }
};
export const normalBackgroundAdmin = async (req, res, callback) => {
  try {
    const user_id = await AuthService.verifyAdminToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(user_id, async (err, data) => {
      if (err) {
        return callback(err, null, null);
      }
      return callback(null, user_id);
    });
  } catch (error) {
    return callback(error, null);
  }
};
export const normalBackgroundUser = async (req, res, callback) => {
  try {
    const user_id = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(user_id, async (err, data) => {
      if (err) {
        return callback(err, null, null);
      }
      return callback(null, user_id);
    });
  } catch (error) {
    return callback(error, null);
  }
};
