import jwt from "jsonwebtoken";
import { getRelationshipsService, addRelationshipService, deleteRelationshipService } from "../services/RelationshipService.js";

export const getRelationships = (req, res) => {
  const followedUserId = req.query.followedUserId;

  getRelationshipsService(followedUserId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUserId = userInfo.id;
    const followedUserId = req.body.userId;

    addRelationshipService(followerUserId, followedUserId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUserId = userInfo.id;
    const followedUserId = req.query.userId;

    deleteRelationshipService(followerUserId, followedUserId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};