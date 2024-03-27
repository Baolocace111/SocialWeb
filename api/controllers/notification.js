import { AuthService } from "../services/AuthService.js";
import {
  getNotificationsByUserService,
  deleteNotificationService,
  unreadNotificationService,
} from "../services/NotificationService.js";
export const getNotificationsController = async (req, res) => {
  try {
    const { page } = req.params;
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      getNotificationsByUserService(userId, page, (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      deleteNotificationService(userId, id, (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const unreadNotificationCountController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    // Kiểm tra xem tài khoản có bị cấm không
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }

      // Nếu tài khoản không bị cấm, tiếp tục xử lý
      unreadNotificationService(userId, (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
