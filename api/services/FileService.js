import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FileOriginFileModel } from "../models/FileModel.js";

// Get the current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths to the video and image directories
const VideoPath = path.join(__dirname, "../uploads/videos");
const ImagePath = path.join(__dirname, "../uploads/images");

// Define the number of files per page for pagination
const pageSize = 10;
export const deleteFileByFilePath = (path, callback) => {
  fs.unlink(path, (error) => {
    if (error) return callback(error, null);
    return callback(null, "Deleted!");
  });
};
export const getImageFiles = (page, callback) => {
  fs.readdir(ImagePath, (err, files) => {
    if (err) {
      return callback("Unable to scan directory", null);
    }

    // Create full paths for each file
    const fullPathFiles = files.map((file) => path.join(ImagePath, file));

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedFiles = fullPathFiles.slice(
      startIndex,
      startIndex + pageSize
    );

    return callback(null, {
      page,
      pageSize,
      totalFiles: files.length,
      files: paginatedFiles,
    });
  });
};

export const getVideoFiles = (page, callback) => {
  fs.readdir(VideoPath, (err, files) => {
    if (err) {
      return callback("Unable to scan directory", null);
    }

    // Create full paths for each file
    const fullPathFiles = files.map((file) => path.join(VideoPath, file));

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedFiles = fullPathFiles.slice(
      startIndex,
      startIndex + pageSize
    );

    return callback(null, {
      page,
      pageSize,
      totalFiles: files.length,
      files: paginatedFiles,
    });
  });
};
export const findOriginFileService = async (filePath, callback) => {
  FileOriginFileModel(filePath, (error, data) => {
    if (error) return callback(error, null);
    return callback(null, data);
  });
};
