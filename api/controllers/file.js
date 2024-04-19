import { upload, getFile } from "../Multer.js";
import path from "path";
export const testupFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json(err);
    if (!req.file) return res.status(500).json("no file");
    if (!req.body.type) return res.status(500).json("miss value");
    try {
      //return res.status(200).json(req.file.path);
      const absolutePath = path.resolve(`..\\api\\` + req.file.path);
      //console.log(absolutePath);
      return res.sendFile(absolutePath);
    } catch (error) {
      //console.log(error);
      return res.status(500).json(error);
    }
  });
};
