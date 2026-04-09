import { v2 as cloudinary } from "cloudinary";
import config from "./config.js";

const hasCloudinaryConfig = Boolean(
  config.cloudinary.cloudName &&
  config.cloudinary.apiKey &&
  config.cloudinary.apiSecret
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export const isCloudinaryConfigured = () => hasCloudinaryConfig;

export default cloudinary;
