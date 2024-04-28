import jwt from "jsonwebtoken";
import {
  getRelationshipsService,
  addRelationshipService,
  deleteRelationshipService,
} from "../services/RelationshipService.js";
import { AuthService } from "../services/AuthService.js";
import { SECRET_KEY } from "../services/AuthService.js";
import { normalBackgroundUser } from "./backgroundController.js";
export const getRelationships = async (req, res) => {
  try {
    const followedUserId = await req.query.followedUserId;
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    AuthService.IsAccountBanned(userId, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "This account is banned" });
      }
      getRelationshipsService(followedUserId, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    const followerUserId = userid;
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
  normalBackgroundUser(req, res, (error, userid) => {
    if (error) return res.status(500).json(error);
    const followerUserId = userid;
    const followedUserId = req.query.userId;

    deleteRelationshipService(followerUserId, followedUserId, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
