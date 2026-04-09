import { StatusCodes } from "http-status-codes";
import { uploadService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

export const uploadImage = catchAsync(async (req, res) => {
  const folder = req.body?.folder || "mummas-kitchen";
  const image = await uploadService.uploadImageToCloudinary(req.file, { folder });

  res.status(StatusCodes.OK).json({
    success: true,
    image,
  });
});
