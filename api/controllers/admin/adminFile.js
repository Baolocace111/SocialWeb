import {
  getImageFiles,
  getVideoFiles,
  findOriginFileService,
  deleteFileByFilePath,
} from "../../services/FileService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";
import fs from "fs";
export const getImageFileController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    getImageFiles(parseInt(req.query.page) || 1, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const getVideoFileController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    getVideoFiles(parseInt(req.query.page) || 1, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const findOriginFromFilePathController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    findOriginFileService(req.body.filepath, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};
export const getFileFromFilePathController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    const data = req.query.path;
    if (!data) return res.status(500).json("Path not found");
    if (!fs.existsSync(data))
      return res.status(404).json({ error: "File not found" });
    return res.sendFile(data);
  });
};
export const deleteFileFromFilePathController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) {
      return res.status(500).json(err);
    }
    const data = req.body.path;
    if (!data) return res.status(500).json("Path not found");
    if (!fs.existsSync(data)) {
      return res.status(404).json({ error: "File not found" });
    }
    deleteFileByFilePath(data, (error, data) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(data);
    });
  });
};
