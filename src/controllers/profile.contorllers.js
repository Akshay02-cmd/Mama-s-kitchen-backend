import CUSTOMER from "../db/CustomerProfile.db.js";
import OWNER from "../db/MessProfile.db.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const CreateProfileCustomer = async (req, res) => {
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
};

export const UpdateProfileCustomer = async (req, res) => {
  const userId = req.user.userId;
  const { phone, address } = req.body;

  const profile = await CustomerProfile.findOneAndUpdate(
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
};

export const GetProfileCustomer = async (req, res) => {
  const userId = req.user.userId;
  const profile = await CUSTOMER.findById(userId);
  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }
  res.status(StatusCodes.OK).json({ profile });
};

export const CreateProfileOwner = async (req, res) => {
  const userId = req.user.userId;
  const { phone, address, messName, area, description } = req.body;
  const profile = await OWNER.create({
    userId,
    phone,
    address,
    messName,
    area,
    description,
  });
  if (!profile) {
    throw new BadRequestError("Unable to create owner profile");
  }
  res.status(StatusCodes.CREATED).json({ profile });
};

export const UpdateProfileOwner = async (req, res) => {
  const userId = req.user.userId;
  const { phone, address, messName, area, description } = req.body;
  const profile = await OWNER.findOneAndUpdate(
    { userId },
    { phone, address, messName, area, description },
    { new: true, runValidators: true }
  );  
  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }
  res.status(StatusCodes.OK).json({ profile });
};

export const GetProfileOwner = async (req, res) => {
  const userId = req.user.userId;
  const profile = await OWNER.findOne({ userId });
  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }
  res.status(StatusCodes.OK).json({ profile });
  res.send("get Owner profile");
};
