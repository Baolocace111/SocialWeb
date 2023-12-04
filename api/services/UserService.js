import * as userModel from "../models/UserModel.js";
import { checkFriendshipStatus } from "./FriendshipService.js";
import { AuthModel } from "../models/AuthModel.js";
import bcrypt from "bcryptjs";
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
export const changePasswordService = async (userid, newps, oldps, callback) => {
  try {
    const user = await AuthModel.getUserByid(userid);
    if (!user) return callback("user not found", null);

    const checkPassword = await bcrypt.compareSync(oldps, user.password);
    if (!checkPassword) return callback("Wrong password", null);

    const salt = await bcrypt.genSaltSync(10);
    const hashednewPassword = await bcrypt.hashSync(newps, salt);
    userModel.updatePasswordUser(userid, hashednewPassword, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  } catch (error) {
    console.log(error);
    return callback(error, null);
  }
};
