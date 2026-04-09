import { StatusCodes } from "http-status-codes";
import { uploadService } from "../services/index.js";
import { BadRequestError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

export const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No image file provided. Please select an image to upload.");
  }

  const folder = req.body?.folder || "mummas-kitchen";
  const image = await uploadService.uploadImageToCloudinary(req.file, { folder });

  res.status(StatusCodes.OK).json({
    success: true,
    image,
  });
});
