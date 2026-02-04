import { StatusCodes } from "http-status-codes";
import { profileService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

export const CreateProfileCustomer = catchAsync(async (req, res) => {
  const profile = await profileService.createCustomerProfile(req.user.userId, req.body);
  res.status(StatusCodes.CREATED).json({ profile });
});

export const UpdateProfileCustomer = catchAsync(async (req, res) => {
  const profile = await profileService.updateCustomerProfile(req.user.userId, req.body);
  res.status(StatusCodes.OK).json({
    success: true,
    profile,
  });
});

export const GetProfileCustomer = catchAsync(async (req, res) => {
  const profile = await profileService.getCustomerProfile(req.user.userId);
  res.status(StatusCodes.OK).json({ profile });
});

export const CreateProfileOwner = catchAsync(async (req, res) => {
  const profile = await profileService.createOwnerProfile(req.user.userId, req.body);
  res.status(StatusCodes.CREATED).json({ profile });
});

export const UpdateProfileOwner = catchAsync(async (req, res) => {
  const profile = await profileService.updateOwnerProfile(req.user.userId, req.body);
  res.status(StatusCodes.OK).json({ profile });
});

export const GetProfileOwner = catchAsync(async (req, res) => {
  const profile = await profileService.getOwnerProfile(req.user.userId);
  res.status(StatusCodes.OK).json({ profile });
});
