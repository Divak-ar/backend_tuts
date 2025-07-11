import { supportedMimeType } from "../config/filesystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export const imageValidator = (size, mimetype) => {
  if (bytesToMb(size) > 2) {
    return "Image size must be less than 2MB";
  } else if (!supportedMimeType.includes(mimetype)) {
    return "Doesn't support this file format, Image must be og jpg,svg,gif,png,webp";
  }

  return null;
};

export const bytesToMb = (bytes) => {
  return bytes / 1024 / 1024;
};

export const generateRandomNum = () => {
  return uuidv4();
};

export const getImageUrl = (imgName) => {
  return `${process.env.APP_URL}/images/${imgName}`;
};

export const removeImage = (imgName) => {
  const path = process.cwd() + "/public/images/" + imgName;
  // check if file exists
  if (fs.existsSync(path)) {
    // if it exist then remove it
    fs.unlinkSync(path);
  }
};

export const uploadImage = (image) => {
  const imgExt = image?.name.split(".");
  const imageName = `${generateRandomNum()}.${imgExt[imgExt.length - 1]}`;
  const uploadPath = process.cwd() + "/public/images/" + imageName;
  image.mv(uploadPath, (err) => {
    if (err) throw err;
  });

  return imageName;
};
