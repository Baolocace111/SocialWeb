import { response } from "express";
import {
  addFeedback,
  deleteFeedbackById,
  getFeedbackById,
  getFeedbacks,
  getFeedbacksByMonthAndYear,
  getFeedbacksByStatus,
  getImgByFeedbackId,
  updateFeedbackResponseAndStatusById,
  updateFeedbackStatusById,
} from "../models/FeedbackModel.js";
import {
  deleteComment,
  deleteCommentByAdmin,
  getCommentByCommentId,
} from "../models/CommentModel.js";
import {
  deletePostByAdminService,
  getPostByIdAdminService,
} from "./AdminService.js";
import { addNotificationService } from "./NotificationService.js";
import { setReputation } from "../models/UserModel.js";
import { deleteStory } from "../models/StoryModel.js";

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
export const addPostFeedbackService = (
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

export const addTeamFeedbackService = (
  desc,
  userId,
  teamId,
  rate,
  img,
  callback
) => {
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

export const addUserReportedFeedbackService = (
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

export const getImgByFeedbackIdService = (fbid, callback) => {
  getImgByFeedbackId(fbid, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const getFeedbackByIdService = (fbid, callback) => {
  getFeedbackById(fbid, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const getAvatarFeedbackService = (feedback, callback) => {
  if (feedback.comment_id) {
    getCommentByCommentId(feedback.comment_id, (e, data) => {
      if (e) return callback(e, null);
      return callback(null, {
        img: `users/profilePic/${data.userId}`,
        type: 1,
        link: `/seepost/${data.postId}`,
      });
    });
  } else if (feedback.post_id) {
    getPostByIdAdminService(feedback.post_id, (e, data) => {
      if (e) return callback(e, null);
      return callback(null, {
        img: `users/profilePic/${data.userid}`,
        type: 2,
        link: `/seepost/${data.id}`,
      });
    });
  } else if (feedback.user_reported_userid) {
    return callback(null, {
      img: `users/profilePic/${feedback.user_reported_userid}`,
      type: 3,
      link: `/profile/${feedback.user_reported_userid}`,
    });
  } else if (feedback.teamid) {
    return callback(null, { img: null, type: 4, link: null });
  } else if (feedback.stories_id) {
    return callback(null, { img: null, type: 5, link: null });
  } else {
    return callback(null, { img: null, type: 0, link: null });
  }
};
export const responseToUserFeedbackService = (fbid, response, callback) => {
  updateFeedbackResponseAndStatusById(fbid, response, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
export const handleDeleteDataFeedbackService = (feedback, callback) => {
  if (feedback.comment_id) {
    deleteCommentByAdmin(feedback.comment_id, (e, d) => {
      if (e) return callback(e, null);
      return callback(null, { data: d, type: 1 });
    });
  } else if (feedback.post_id) {
    deletePostByAdminService(feedback.post_id, (e, d) => {
      if (e) return callback(e, null);
      return callback(null, { data: d, type: 2 });
    });
  } else if (feedback.user_reported_userid) {
    setReputation(feedback.user_reported_userid, 0, (e, d) => {
      if (e) return callback(e, null);
      return callback(null, { data: d, type: 3 });
    });
  } else if (feedback.teamid) {
    return callback(null, { type: 4 });
  } else if (feedback.stories_id) {
    return callback(null, { type: 5 });
  } else {
    return callback(null, { type: 0 });
  }
};
