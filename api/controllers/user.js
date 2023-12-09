import * as userService from "../services/UserService.js";
import { AuthService } from "../services/AuthService.js";

export const getUser = (req, res) => {
  userService.getUser(req, res);
};

export const getUsers = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

    userService.getUsers(userId, Number(req.query.offset), (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getFollowedUsers = (req, res) => {
  userService.getFollowedUsers(req, res);
};

export const updateUser = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    return userService.updateUser(userId, req, res);
  } catch (err) {
    return res.status(500).json({ error: error });
  }
};
export const findUserByName = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    userService.findUsersByName(userId, req.params.name, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error: error });
  }
};
export const changePasswordController = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    if (req.body.password !== req.body.repassword)
      return res.status(500).json("Password and Re-Password aren't match");
    else if (req.body.password === req.body.oldpassword)
      return res.status(500).json("You aren't changing your password");
    else
      userService.changePasswordService(
        userId,
        req.body.password,
        req.body.oldpassword,
        (err, data) => {
          if (err) return res.status(500).json(err);
          else return res.status(200).json(data);
        }
      );
  } catch (error) {
    //console.log(error);
    return res.status(500).json(error.body);
  }
};
