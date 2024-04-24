import { db } from "../connect.js";
export const getFeedbacks = (page, pageSize, callback) => {
  const offset = (page - 1) * pageSize;
  const q =
    "SELECT feedbacks.*,u.id AS userid, u.name FROM feedbacks LEFT JOIN users u ON (feedbacks.userid = u.id) ORDER BY createdAt DESC LIMIT ?, ? ";
  const values = [offset, pageSize];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);

    // Loại bỏ thuộc tính 'img' từ mỗi phần tử trong mảng data
    const feedbacksWithoutImg = data.map((feedback) => {
      const { img, ...feedbackWithoutImg } = feedback;
      return feedbackWithoutImg;
    });

    return callback(null, feedbacksWithoutImg);
  });
};
export const getFeedbacksByMonthAndYear = (
  month,
  year,
  page,
  pageSize,
  callback
) => {
  const offset = (page - 1) * pageSize;
  const q =
    "SELECT feedbacks.*,u.id AS userid, u.name FROM feedbacks LEFT JOIN users u ON (feedbacks.userid = u.id) WHERE MONTH(createdAt) = ? AND YEAR(createdAt) = ? ORDER BY createdAt DESC LIMIT ?, ?";
  const values = [month, year, offset, pageSize];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    const feedbacksWithoutImg = data.map((feedback) => {
      const { img, ...feedbackWithoutImg } = feedback;
      return feedbackWithoutImg;
    });
    return callback(null, feedbacksWithoutImg);
  });
};
export const deleteFeedbackById = (feedbackId, callback) => {
  const q = "DELETE FROM feedbacks WHERE id = ?";
  const values = [feedbackId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Feedback has been deleted.");
  });
};
export const addFeedback = (
  desc,
  userId,
  rate,
  commentId,
  postId,
  userReportedUserId,
  teamId,
  storiesId,
  img,
  callback
) => {
  const q =
    "INSERT INTO feedbacks (`desc`, userid, rate, comment_id, post_id, user_reported_userid, teamid, stories_id, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    desc,
    userId,
    rate || null,
    commentId || null,
    postId || null,
    userReportedUserId || null,
    teamId || null,
    storiesId || null,
    img || null,
  ];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Feedback has been created.");
  });
};
export const getImgByFeedbackId = (feedbackId, callback) => {
  const q = "SELECT img FROM feedbacks WHERE id = ? AND img IS NOT NULL"; // Đảm bảo chỉ lấy img không phải là null
  const values = [feedbackId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.length > 0) {
      return callback(null, data[0].img); // Trả về img nếu có
    } else {
      return callback(null, null); // Trả về null nếu không có img hoặc feedbackId không tồn tại
    }
  });
};
export const updateFeedbackStatusById = (feedbackId, newStatus, callback) => {
  const q = "UPDATE feedbacks SET status = ? WHERE id = ?";
  const values = [newStatus, feedbackId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, "Feedback status has been updated.");
  });
};

export const getFeedbackById = (feedbackId, callback) => {
  const q =
    "SELECT feedbacks.*,u.id AS userid, u.name FROM feedbacks LEFT JOIN users u ON (feedbacks.userid = u.id) WHERE id = ?";
  const values = [feedbackId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    if (data.length > 0) {
      const { img, ...feedbackWithoutImg } = data[0];
      return callback(null, feedbackWithoutImg);
    } else {
      return callback(null, null); // Không tìm thấy phản hồi với ID tương ứng
    }
  });
};

export const getFeedbacksByStatus = (status, page, pageSize, callback) => {
  const offset = (page - 1) * pageSize;
  const q =
    "SELECT feedbacks.*,u.id AS userid, u.name FROM feedbacks LEFT JOIN users u ON (feedbacks.userid = u.id) WHERE status = ? ORDER BY createdAt DESC LIMIT ?, ?";
  const values = [status, offset, pageSize];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    const feedbacksWithoutImg = data.map((feedback) => {
      const { img, ...feedbackWithoutImg } = feedback;
      return feedbackWithoutImg;
    });
    return callback(null, feedbacksWithoutImg);
  });
};
export const updateFeedbackResponseAndStatusById = (
  feedbackId,
  response,
  callback
) => {
  const q = "UPDATE feedbacks SET response = ?, status = 2 WHERE id = ?";
  const values = [response, feedbackId];

  db.query(q, values, (err, data) => {
    if (err) return callback(err, null);
    return callback(
      null,
      "Feedback response has been updated and status set to 2."
    );
  });
};
