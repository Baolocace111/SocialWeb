import {
  getImageFiles,
  getVideoFiles,
  findOriginFileService,
  deleteFileByFilePath,
} from "../../services/FileService.js";
import { normalBackgroundAdmin } from "../backgroundController.js";
import fs from "fs";
import path from "path";
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
const isImageOrVideo = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
  const videoExtensions = [".mp4", ".avi", ".mov", ".mkv"];
  return imageExtensions.includes(ext) || videoExtensions.includes(ext);
};

export const findOriginFromFilePathController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    const { filepath } = req.body;
    if (!isImageOrVideo(filepath))
      return res.status(500).json("Path không phù hợp");
    findOriginFileService(filepath, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getFileFromFilePathController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    const data = req.query.path;
    if (!data) return res.status(500).json("Path không phù hợp");
    if (!isImageOrVideo(data))
      return res.status(500).json("Path không phù hợp");
    if (!fs.existsSync(data))
      return res.status(404).json({ error: "File not found" });
    return res.sendFile(data);
  });
};

export const deleteFileFromFilePathController = (req, res) => {
  normalBackgroundAdmin(req, res, (err, userid) => {
    if (err) return res.status(500).json(err);
    const data = req.body.path;
    if (!data) return res.status(500).json("Path không phù hợp");
    if (!isImageOrVideo(data))
      return res.status(500).json("Path không phù hợp");
    if (!fs.existsSync(data))
      return res.status(404).json({ error: "File not found" });
    deleteFileByFilePath(data, (error, result) => {
      if (error) return res.status(500).json(error);
      return res.status(200).json(result);
    });
  });
};
