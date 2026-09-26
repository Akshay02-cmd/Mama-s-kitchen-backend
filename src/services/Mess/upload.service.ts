import cloudinary, { isCloudinaryConfigured } from "../../config/cloudinary.js";
import { BadRequestError, CustomApiError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";

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

  let result;
  try {
    result = await cloudinary.uploader.upload(fileDataUri, {
      folder: options.folder || "mummas-kitchen",
      resource_type: "image",
      transformation: [
        {
          fetch_format: "auto",
          quality: "auto",
        },
      ],
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "Unknown Cloudinary error";

    if (message.includes("Invalid Signature")) {
      throw new CustomApiError(
        "Cloudinary credentials are invalid. Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        StatusCodes.BAD_GATEWAY,
      );
    }

    throw new CustomApiError(
      `Image upload failed: ${message}`,
      StatusCodes.BAD_GATEWAY,
    );
  }

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
