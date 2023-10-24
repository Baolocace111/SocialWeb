import * as userService from "../services/UserService.js";
import { AuthService } from "../services/AuthService.js";

export const getUser = (req, res) => {
  userService.getUser(req, res);
};

export const getUsers = (req, res) => {
  userService.getUsers(req, res);
};

export const getFollowedUsers = (req, res) => {
  userService.getFollowedUsers(req, res);
};

export const updateUser = (req, res) => {
  userService.updateUser(req, res);
};
export const findUserByName = async (req, res) => {
  try {
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    userService.findUsersByName(userId,req.params.name, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({error:error});
  }
};
