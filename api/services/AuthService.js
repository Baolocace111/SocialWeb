import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthModel } from "../models/AuthModel.js";
import { getReputation } from "../models/UserModel.js";
const key = "secretkey";
export const AuthService = {
  async register(username, email, password, name) {
    try {
      const userExists = await AuthModel.checkIfUserExists(username);
      if (userExists) throw new Error("User already exists!");

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await AuthModel.createUser(username, email, hashedPassword, name);

      return "User has been created.";
    } catch (err) {
      throw err;
    }
  },

  async login(username, password) {
    try {
      const user = await AuthModel.getUserByUsername(username);

      return new Promise((resolve, reject) => {
        this.IsAccountBanned(user.id, (err, data) => {
          if (err) return reject(err);
          if (!user) return reject(new Error("User not found!"));

          const checkPassword = bcrypt.compareSync(password, user.password);
          if (!checkPassword)
            return reject(new Error("Wrong password or username!"));

          const token =
            user.role === 1
              ? jwt.sign({ id: user.id, isadmin: true }, "secretkey")
              : jwt.sign({ id: user.id }, "secretkey");

          const { password: _, ...others } = user;

          return resolve({ token, user: others, isbanned: false });
        });
      });
    } catch (err) {
      return new Promise((resolve, reject) => {
        return reject(new Error(err));
      });
    }
  },
  async verifyUserToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (err, userInfo) => {
        if (err) {
          //console.log(err);
          reject(-1);
        } else {
          resolve(userInfo.id);
        }
      });
    });
  },
  async verifyAdminToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (err, userInfo) => {
        if (err) {
          reject("This is not account");
        }
        if (userInfo.isadmin) {
          resolve(userInfo.id);
        } else reject("You are not admin");
      });
    });
  },
  IsAccountBanned(user_id, callback) {
    getReputation(user_id, (err, data) => {
      if (err) return callback(err, null);

      if (data.reputation < 1) {
        return callback("This account is banned!!!", null);
      }
      return callback(null, data.reputation);
    });
  },
};
