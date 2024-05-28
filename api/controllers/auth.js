import { AuthService } from "../services/AuthService.js";
import { clients } from "../index.js";
import {
  AddConfirmEmail,
  ConfirmCodeService,
  removeEmailVerifyService,
} from "../services/RegisterService.js";
import { AuthModel } from "../models/AuthModel.js";
export const sendConfirmCode = async (req, res) => {
  try {
    const email = await (req.body.email || "");
    if (email === "") return res.status(500).json("Bạn chưa nhập Email");
    else {
      const userExists = await AuthModel.checkIfEmailExists(email);

      if (userExists)
        return res
          .status(500)
          .json("Email của bạn đã được đăng ký bởi tài khoản khác");
      else
        AddConfirmEmail(email, req.body.language, (error, info) => {
          if (error) {
            return res.status(500).json(error);
          } else return res.status(200).json("Verification code was sent");
        });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const register = async (req, res) => {
  const user = await req.body.username;
  const email = await req.body.email;
  const password = await req.body.password;
  const name = await req.body.name;
  const repassword = await req.body.repassword;
  const verify = await (req.body.verification || "");
  if (verify === "")
    return res
      .status(500)
      .json(
        `Bạn chưa có mã xác nhận ? Hãy điền vào ô Email và chọn 'gửi đi' lấy mã xác nhận`
      );
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
    return res.status(500).json("Username is invalid");
  }
  try {
    if (
      user === "" ||
      email === "" ||
      password === "" ||
      name === "" ||
      repassword === ""
    )
      return await res.status(500).json("Fill out the form");
    else if (password !== repassword)
      return await res
        .status(500)
        .json("Password and re-entered password do not match");
    else
      ConfirmCodeService(email, verify, async (error, data) => {
        if (error) return res.status(500).json(error);
        else {
          const result = await AuthService.register(
            user,
            email,
            password,
            name
          );
          removeEmailVerifyService(email);
          return res.status(200).json(result);
        }
      });
  } catch (err) {
    if (err.message.includes("for key 'users.email_UNIQUE'"))
      return res
        .status(500)
        .json("Email của bạn đã được đăng ký bởi tài khoản khác");
    return res.status(500).json(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const result = await AuthService.login(
      req.body.username,
      req.body.password
    );

    if (result.isbanned) return res.status(500).json("This account be banned");
    res
      .cookie("accessToken", result.token, {
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ ...result.user, token: result.token });
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
      .json({ ...result.user, token: result.token });
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
export const checkConnectionController = (req, res) => {
  return res.status(200).json({ webversion: "1.0.0", appversion: "1.0.0" });
};
