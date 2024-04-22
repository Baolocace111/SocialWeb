import { months } from "moment/moment";
import {
  addFeedback,
  deleteFeedbackById,
  getFeedbacks,
  getFeedbacksByMonthAndYear,
  getFeedbacksByStatus,
  getImgByFeedbackId,
  updateFeedbackStatusById,
} from "../models/FeedbackModel.js";

export const getFeedbacksService = (page, callback) => {
  getFeedbacks(page, 10, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getFeedbacksByStatusService = (stt, page, callback) => {
  getFeedbacksByStatus(stt, page, 10, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const setStatusFeedbackService = (stt, id, callback) => {
  updateFeedbackStatusById(id, stt, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const getFeedbacksByMonthAndYearService = (
  month,
  year,
  page,
  callback
) => {
  getFeedbacksByMonthAndYear(month, year, page, 10, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const deleteFeedbackService = (feedbackId, callback) => {
  deleteFeedbackById(feedbackId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const addCommentFeedbackService = (
  desc,
  userId,
  rate,
  commentId,
  img,
  callback
) => {
  addFeedback(
    desc,
    userId,
    rate,
    commentId,
    null, // Không cần truyền postId, userReportedUserId, teamId, storiesId vào hàm này
    null,
    null,
    null,
    img,
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};
export const addCommentService = (
  desc,
  userId,
  postId,
  rate,
  img,
  callback
) => {
  addFeedback(
    desc,
    userId,
    rate,
    null, // Không cần truyền commentId vào hàm này
    postId,
    null, // Không cần truyền userReportedUserId, teamId, storiesId vào hàm này
    null,
    null,
    img,
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};

export const addPostService = (desc, userId, teamId, rate, img, callback) => {
  addFeedback(
    desc,
    userId,
    rate,
    null, // Không cần truyền commentId, postId vào hàm này
    null,
    null, // Không cần truyền userReportedUserId, storiesId vào hàm này
    teamId,
    null,
    img,
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};

export const addUserReportedService = (
  desc,
  userId,
  userReportedUserId,
  rate,
  callback
) => {
  addFeedback(
    desc,
    userId,
    rate,
    null, // Không cần truyền commentId, postId, teamId, storiesId vào hàm này
    null,
    userReportedUserId,
    null,
    null,
    null,
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};

export const addTeamService = (desc, userId, teamId, rate, callback) => {
  addFeedback(
    desc,
    userId,
    rate,
    null, // Không cần truyền commentId, postId, userReportedUserId, storiesId vào hàm này
    null,
    null,
    teamId,
    null,
    null,
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};

export const addStoriesService = (
  desc,
  userId,
  storiesId,
  rate,
  img,
  callback
) => {
  addFeedback(
    desc,
    userId,
    rate,
    null, // Không cần truyền commentId, postId, userReportedUserId, teamId vào hàm này
    null,
    null,
    null,
    storiesId,
    img,
    (error, data) => {
      if (error) return callback(error, null);
      return callback(null, data);
    }
  );
};
export const getImgByFeedbackIdService = (fbid, callback) => {
  getImgByFeedbackId(fbid, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
