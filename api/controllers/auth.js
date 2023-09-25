import { AuthService } from "../services/AuthService.js";

export const register = async (req, res) => {
  try {
    const result = await AuthService.register(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.name
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const result = await AuthService.login(
      req.body.username,
      req.body.password
    );
    res
      .cookie("accessToken", result.token, {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json(result.user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};