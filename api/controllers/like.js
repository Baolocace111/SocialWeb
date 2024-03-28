import {
  getLikesService,
  addLikeWithTokenService,
  deleteLikeWithTokenService,
} from "../services/LikeService.js";
import { AuthService } from "../services/AuthService.js";
export const getLikes = (req, res) => {
  try {
    const postId = req.query.postId;

    // Lấy thông tin người dùng từ token
    AuthService.verifyUserToken(req.cookies.accessToken)
      .then((userId) => {
        // Kiểm tra xem tài khoản có bị cấm không
        AuthService.IsAccountBanned(userId, (err, data) => {
          if (err) {
            return res.status(500).json({ error: "This account is banned" });
          }

          // Nếu tài khoản không bị cấm, tiếp tục xử lý
          getLikesService(postId, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
          });
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addLike = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const postId = req.body.postId;

    // Lấy thông tin người dùng từ token
    AuthService.verifyUserToken(token)
      .then((userId) => {
        // Kiểm tra xem tài khoản có bị cấm không
        AuthService.IsAccountBanned(userId, (err, data) => {
          if (err) {
            return res.status(500).json({ error: "This account is banned" });
          }

          // Nếu tài khoản không bị cấm, tiếp tục xử lý
          addLikeWithTokenService(token, postId, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
          });
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteLike = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const postId = req.query.postId;

    // Lấy thông tin người dùng từ token
    AuthService.verifyUserToken(token)
      .then((userId) => {
        // Kiểm tra xem tài khoản có bị cấm không
        AuthService.IsAccountBanned(userId, (err, data) => {
          if (err) {
            return res.status(500).json({ error: "This account is banned" });
          }

          // Nếu tài khoản không bị cấm, tiếp tục xử lý
          deleteLikeWithTokenService(token, postId, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
          });
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
