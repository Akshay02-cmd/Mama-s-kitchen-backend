import { StatusCodes } from "http-status-codes";
import { userService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

const getallUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(StatusCodes.OK).json({ users });
});

const getallCustomers = catchAsync(async (req, res) => {
  const customers = await userService.getAllCustomers();
  res.status(StatusCodes.OK).json({ customers });
});

const getallOwners = catchAsync(async (req, res) => {
  const owners = await userService.getAllOwners();
  res.status(StatusCodes.OK).json({ owners });
});

export { getallUsers, getallCustomers, getallOwners };