import multer from "multer";
import path from "path";
import fs from "fs";
// Khởi tạo multer và cấu hình nơi lưu trữ file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    // Kiểm tra loại file
    if (file.mimetype.startsWith("video")) {
      uploadPath = "./uploads/videos";
    } else if (file.mimetype.startsWith("image")) {
      const getTypeDirectory = (type) => {
        switch (type) {
          case "0":
            return "./uploads/images/avatar";
          case "1":
            return "./uploads/images/cover";
          case "2":
            return "./uploads/images/post";
          case "3":
            return "./uploads/images/story";
          default:
            throw new Error("Invalid image type specified");
        }
      };
      //console.log(req.body);
      //const type = req.body.type;
      //console.log(type);
      try {
        uploadPath = getTypeDirectory("0");
      } catch (error) {
        return cb("Type không đúng");
      }
    } else {
      return cb("File is invalid");
    }

    // Tạo thư mục nếu chưa tồn tại
    fs.mkdirSync(uploadPath, { recursive: true });
    return cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
  },
});

// Hàm middleware để xử lý upload file
export const upload = multer({ storage }).single("file"); // 'file' là tên field của input file trong form

// Hàm để lấy file từ đường dẫn
export const getFile = (filePath) => {
  try {
    const absolutePath = path.resolve(`.\\` + filePath);
    return fs.readFileSync(absolutePath);
  } catch (err) {
    console.log(err);
    return err;
  }
};
