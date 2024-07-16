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
      uploadPath = "./uploads/images";

      //console.log(req.body);
      //const type = req.body.type;
      //console.log(type);
      try {
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
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
}).single("file"); // 'file' là tên field của input file trong form

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
