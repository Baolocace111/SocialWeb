import * as userService from "../services/UserService.js";

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
export const findUserByName=(req,res)=>{
userService.findUsersByName(req,res);
};