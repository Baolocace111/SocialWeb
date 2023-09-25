import { getLikesService, addLikeWithTokenService, deleteLikeWithTokenService } from "../services/LikeService.js";

export const getLikes = (req, res) => {
  const postId = req.query.postId;
  getLikesService(postId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  const postId = req.body.postId;
  addLikeWithTokenService(token, postId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  const postId = req.query.postId;
  deleteLikeWithTokenService(token, postId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};