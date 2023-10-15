import * as userModel from "../models/UserModel.js";

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
export const findUsersByName =(req,res)=>{
  const name=req.params.name;
  userModel.findUserByName(name,(err,data)=>{
    if (err) return res.status(500).json(err);
    return res.json(data);
  })
}

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    userModel.updateUser({...req.body, id: userInfo.id }, (err, data) => {
      if (err) res.status(500).json(err);
      return res.json(data);
    });
  });
};