import { AuthService } from "../services/AuthService.js";
import { clients } from "../index.js";
export const register = async (req, res) => {
  const user = await req.body.username;
  const email = await req.body.email;
  const password = await req.body.password;
  const name = await req.body.name;
  const repassword = await req.body.repassword;
  function isValidUsername(username) {
    // Kiểm tra có khoảng trắng không
    if (username.includes(" ")) {
      return false;
    }

    // Kiểm tra có ký tự đặc biệt không
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChars.test(username)) {
      return false;
    }

    // Kiểm tra có dấu không
    const accents =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễđìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄĐÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]/;
    if (accents.test(username)) {
      return false;
    }

    return true;
  }
  if (!isValidUsername(user)) {
    return res.status(200).json("Username is invalid");
  }
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
        sameSite: "None",
      })
      .status(200)
      .json(result.user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
export const adminLogin = async (req, res) => {
  try {
    const result = await AuthService.login(
      req.body.username,
      req.body.password
    );
    if (result.user.role !== 1)
      return res.status(500).json("You are not an administrator");

    return res
      .cookie("accessToken", result.token, {
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(result.user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const logout = async (req, res) => {
  try {
    //const id = await AuthService.verifyUserToken(req.cookies.accessToken);
    //const ws = clients.get("index" + id);
    //if (ws) ws.close();
    return res
      .clearCookie("accessToken", {
        //httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json("User has been logged out.");
  } catch (error) {
    //console.log(error);
    return res.status(500).json(error);
  }
};
export const checkAdmin = async (req, res) => {
  try {
    const id = await AuthService.verifyAdminToken(req.cookies.accessToken);
    return res.status(200).json(id);
  } catch (error) {
    return res.status(500).json(error);
  }
};
