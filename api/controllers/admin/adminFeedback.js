import {
  getFeedbacksService,
  deleteFeedbackService,
  getFeedbacksByStatusService,
  getImgByFeedbackIdService,
  getFeedbackByIdService,
  setStatusFeedbackService,
  getAvatarFeedbackService,
  responseToUserFeedbackService,
  handleDeleteDataFeedbackService,
} from "../../services/FeedbackService.js";
import { AuthService } from "../../services/AuthService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";
import fs from "fs";
import { addNotificationService } from "../../services/NotificationService.js";
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
export const getFeedbackImageAdminController = async (req, res) => {
  try {
    normalBackgroundAdmin(req, res, (error, user_id) => {
      if (error) return res.status(500).json(error);
      getImgByFeedbackIdService(req.params.id, (error, data) => {
        if (error) return res.status(500).json(error);
        if (!data) return res.status(200).json("");
        if (!fs.existsSync(data))
          return res.status(404).json({ error: "File not found" });
        return res.sendFile(data);
      });
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
export const handleFeedbackController = async (req, res) => {
  normalBackgroundAdmin(req, res, (e, userid) => {
    if (e) return res.status(500).json(e);

    getFeedbackByIdService(req.body.feedback.id, (e, datafb) => {
      console.log(e);
      if (e) return res.status(500).json(e);
      switch (req.body.type) {
        case 0:
          setStatusFeedbackService(0, req.body.feedback.id, (e, data) => {
            if (e) return res.status(500).json(e);
            return res.status(200).json(data);
          });
          break;
        case 1:
          setStatusFeedbackService(
            1,
            req.body.feedback.id,
            (e, setStatusData) => {
              console.log(e);
              if (e) return res.status(500).json(e);
              getAvatarFeedbackService(datafb, (e, data) => {
                if (e) return res.status(500).json(e);
                addNotificationService(
                  datafb.userid,
                  "Báo cáo của bạn đang được xem xét,Xin cảm ơn vì đã báo cáo",
                  data.link,
                  data.img,
                  (e, data) => {
                    if (e) return res.status(500).json(e);
                    return res.status(200).json(setStatusData);
                  }
                );
              });
            }
          );
          break;
        case 2:
          responseToUserFeedbackService(
            req.body.feedback.id,
            req.body.feedback.response,
            (e, setStatusData) => {
              if (e) return res.status(500).json(e);
              getAvatarFeedbackService(datafb, (e, data) => {
                if (e) return res.status(500).json(e);
                addNotificationService(
                  datafb.userid,
                  req.body.feedback.response,
                  data.link,
                  data.img,
                  (e, data) => {
                    if (e) return res.status(500).json(e);
                    return res.status(200).json(setStatusData);
                  }
                );
              });
            }
          );
          break;
        case 3:
          handleDeleteDataFeedbackService(datafb, (e, resdata) => {
            if (e) return res.status(500).json(e);
            getAvatarFeedbackService(datafb, (e, data) => {
              if (e) return res.status(500).json(e);
              addNotificationService(
                datafb.userid,
                req.body.feedback.response,
                data.link,
                data.img,
                (e, data) => {
                  if (e) return res.status(500).json(e);
                  return res.status(200).json(resdata);
                }
              );
            });
          });
          break;
        default:
          return res.status(500).json("Can't Resolve");
      }
    });
  });
};
