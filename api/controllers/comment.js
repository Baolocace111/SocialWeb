import {
  getCommentsService,
  addCommentWithTokenService,
  deleteCommentWithTokenService,
} from "../services/CommentService.js";

export const getComments = (req, res) => {
  const postId = req.query.postId;
  getCommentsService(postId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  const desc = req.body.desc;
  const postId = req.body.postId;
  if (
    req.body.desc === "" ||
    req.body.desc === undefined ||
    req.body.desc === null
  )
    return res.status(500).json("You haven't comment");
  addCommentWithTokenService(token, desc, postId, (err, data) => {
    if (err) return res.status(500).json("Comment is not valid");
    return res.status(200).json(data);
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  const commentId = req.params.id;
  deleteCommentWithTokenService(token, commentId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
