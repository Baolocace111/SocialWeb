import nodemailer from "nodemailer";
import { trl } from "./Language/language.js";
const generateRandomCode = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP server của bạn, ví dụ: smtp.gmail.com
  port: 587, // Cổng của SMTP server, thông thường là 587 hoặc 465
  secure: false, // True cho 465, false cho các cổng khác
  auth: {
    user: "toiguibanthongbao@gmail.com", // Email của bạn
    pass: "sbnhizrhthorcecl", // Mật khẩu email của bạn
  },
});
const listRegister = new Map();
export const AddConfirmEmail = (email, language, callback) => {
  if (listRegister.has(email)) listRegister.delete(email);
  const confirmCode = generateRandomCode(8);
  listRegister.set(email, confirmCode);
  const mailOptions = {
    from: "toiguibanthongbao@gmail.com",
    to: email,
    subject: trl("Mã xác nhận từ TinySocial", language),
    text:
      trl("Mã của bạn là:") +
      confirmCode +
      `\n` +
      trl(
        "Chỉ nhập mã này trên trang TinySocial và không cung cấp cho bất kỳ ai khác"
      ),
    html: "",
  };
  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, info);
  });
};
export const ConfirmCodeService = (email, code, callback) => {
  if (listRegister.has(email)) {
    if (listRegister.get(email) === code) {
      return callback(null, "That true");
    } else {
      return callback("Wrong code! Try again", null);
    }
  } else {
    return callback("This email does not have a confirmation code", null);
  }
};
export const removeEmailVerifyService = (email) => {
  if (listRegister.has(email)) listRegister.delete(email);
};
