import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import USER from "../model/user.model.js";
import CUSTOMER from "../model/CustomerProfile.model.js";
import OWNER from "../model/OwnerProfile.model.js";
import catchAsync from "../utils/catchAsync.js";

const getallUsers = catchAsync(async (req, res) => {
  const users = await USER.find({});
  if (!users) {
    throw new NotFoundError("No users found");
  }
  res.status(200).json({ users });
});

const getallCustomers = catchAsync(async (req, res) => {
  const customers = await CUSTOMER.find({});
  if (!customers) {
    throw new NotFoundError("No customers found");
  }
  res.status(200).json({ customers });
});

const getallOwners = catchAsync(async (req, res) => {
  const owners = await OWNER.find({});
  if (!owners) {
    throw new NotFoundError("No owners found");
  }
  res.status(200).json({ owners });
});

export { getallUsers, getallCustomers, getallOwners };