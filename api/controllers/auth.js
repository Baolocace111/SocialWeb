import { AuthService } from "../services/AuthService.js";

export const register = async (req, res) => {
  const user = await req.body.username;
  const email = await req.body.email;
  const password = await req.body.password;
  const name = await req.body.name;
  const repassword = await req.body.repassword;
  try {
    if (
      user === "" ||
      email === "" ||
      password === "" ||
      name === "" ||
      repassword === ""
    )
      return await res.status(200).json("Fill out the form");
    if (password !== repassword)
      return await res
        .status(200)
        .json("Password and re-entered password do not match");
    const result = await AuthService.register(user, email, password, name);
    //await console.log(result);
    return res.status(200).json(result);
  } catch (err) {
    //console.log(err.message);
    return res.status(200).json(err.message);
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
