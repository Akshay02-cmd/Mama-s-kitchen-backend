import CUSTOMER from "../model/CustomerProfile.model.js";
import OWNER from "../model/OwnerProfile.model.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

export const CreateProfileCustomer = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { phone, address } = req.body;

  const profile = await CUSTOMER.create({
    userId,
    phone,
    address,
  });
  if (!profile) {
    throw new BadRequestError("Unable to create customer profile");
  }
  res.status(StatusCodes.CREATED).json({ profile });
});

export const UpdateProfileCustomer = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { phone, address } = req.body;

  const profile = await CUSTOMER.findOneAndUpdate(
    { userId },
    { phone, address },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    profile,
  });
});

export const GetProfileCustomer = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const profile = await CUSTOMER.findOne({ userId });
  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }
  res.status(StatusCodes.OK).json({ profile });
});

export const CreateProfileOwner = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { phone, address } = req.body;
  const profile = await OWNER.create({
    userId,
    phone,
    address,
  });
  if (!profile) {
    throw new BadRequestError("Unable to create owner profile");
  }
  res.status(StatusCodes.CREATED).json({ profile });
});

export const UpdateProfileOwner = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { phone, address } = req.body;
  const profile = await OWNER.findOneAndUpdate(
    { userId },
    { phone, address },
    { new: true, runValidators: true }
  );  
  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }
  res.status(StatusCodes.OK).json({ profile });
});

export const GetProfileOwner = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const profile = await OWNER.findOne({ userId });
  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }
  res.status(StatusCodes.OK).json({ profile });
});
