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
export const getUsernameByEmailService = (email, callback) => {
  userModel.getUserByEmail(email, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data.username);
  });
};
export const getUserIDByEmailService = (email, callback) => {
  userModel.getUserByEmail(email, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data.id);
  });
};
export const getCoverPicOrProfilePic = (userid, COrP, callback) => {
  userModel.getUserById(userid, (err, data) => {
    if (err) return callback(err, null);
    if (COrP) return callback(null, data.coverPic);
    else return callback(null, data.profilePic);
  });
};

export const getUsers = (userId, offset, callback) => {
  userModel.getUsers(userId, offset, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
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
export const updateProfilePicService = (userid, profilePic, callback) => {
  userModel.updateProfilePic(userid, profilePic, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const updateCoverPicService = (userid, coverPic, callback) => {
  userModel.updateCoverPic(userid, coverPic, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
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
export const changePasswordServiceByEmail = async (email, newps, callback) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hashednewPassword = await bcrypt.hashSync(newps, salt);
    userModel.updatePasswordEmail(email, hashednewPassword, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  } catch (error) {
    console.log(error);
    return callback(error, null);
  }
};
export const searchUserByNameEmailIdService = (key, page, callback) => {
  if (key === undefined)
    userModel.findAllUsersWithPagination(page, 10, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
  else
    userModel.findUserByNameOEmailOIdOUsername(key, page, 10, (err, data) => {
      if (err) return callback(err, null);
      return callback(null, data);
    });
};
export const setGenderService = (userId, gender, callback) => {
  userModel.setGenderModel(userId, gender, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const setBirthdateService = (userId, date, month, year, callback) => {
  userModel.setBirthdateModel(userId, date, month, year, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const setWebsiteService = (userid, website, callback) => {
  userModel.setWebsiteModel(userid, website, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
export const setCityService = (userid, location, callback) => {
  userModel.setCityModel(userid, location, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
