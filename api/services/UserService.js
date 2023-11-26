import * as userModel from "../models/UserModel.js";
import { checkFriendshipStatus } from "./FriendshipService.js";

export const getUser = (req, res) => {
  const userId = req.params.userId;

  userModel.getUserById(userId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

export const getUsers = (req, res) => {
  userModel.getUsers((err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

export const getFollowedUsers = (req, res) => {
  const userId = req.params.userId;

  userModel.getFollowedUsers(userId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};
export const findUsersByName = (userId, name, callback) => {
  userModel.findUserByName(name, async (err, data) => {
    if (err) return callback("error", null);
    const odata = await Promise.all(
      data.map(async (user) => {
        const friendStatus = await checkFriendshipStatus(userId, user.id);

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          profilePic: user.profilePic,
          coverPic: user.coverPic,
          friendStatus: friendStatus,
        };
      })
    );
    return callback(null, odata);
  });
};

export const updateUser = (userid, req, res) => {
  userModel.updateUser({ ...req.body, id: userid }, (err, data) => {
    if (err) res.status(500).json(err);
    return res.json(data);
  });
};
