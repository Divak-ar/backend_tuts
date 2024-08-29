import { supportedMimeType } from "../config/filesystem.js";
import {v4 as uuidv4} from "uuid";

export const imageValidator = (size, mimetype) => {
    if(bytesToMb(size) > 2){
        return "Image size must be less than 2MB";
    }else if(!supportedMimeType.includes(mimetype)){
        return "Doesn't support this file format, Image must be og jpg,svg,gif,png,webp";
    }

    return null;
}

export const bytesToMb = (bytes) => {
    return bytes / 1024 / 1024;
}

export const generateRandomNum = () => {
    return uuidv4();
}
