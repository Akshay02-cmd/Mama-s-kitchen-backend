import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { BadRequestError } from "../errors/index.js";

export const uploadImageToCloudinary = async (file, options = {}) => {
  if (!file) {
    throw new BadRequestError("Image file is required");
  }

  if (!isCloudinaryConfigured()) {
    throw new BadRequestError(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
    );
  }

  const fileDataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileDataUri, {
    folder: options.folder || "mummas-kitchen",
    resource_type: "image",
    transformation: [
      {
        fetch_format: "auto",
        quality: "auto",
      },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
};

const uploadService = {
  uploadImageToCloudinary,
};

export default uploadService;
