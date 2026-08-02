import {User, CProfile, OProfile} from "../../repository/index.js";
import { NotFoundError } from "../../errors/index.js";

export const getAllUsers = async () => {
  const users = await User.UserAll();
  if (!users || users.length === 0) {
    throw new NotFoundError("No users found");
  }
  return users;
};

export const getAllCustomers = async () => {
  const customers = await CProfile.CustomerAll();
  if (!customers || customers.length === 0) {
    throw new NotFoundError("No customers found");
  }
  return customers;
};

export const getAllOwners = async () => {
  const owners = await OProfile.OwnerAll();
  if (!owners || owners.length === 0) {
    throw new NotFoundError("No owners found");
  }
  return owners;
};

export const getUserStatistics = async () => {
  const [totalUsers, totalCustomers, totalOwners] = await Promise.all([
    User.UserCount(),
    CProfile.CustomerCount(),
    OProfile.OwnerCount(), 
  ]);

  return {
    totalUsers,
    totalCustomers,
    totalOwners,
  };
};

const userService = {
  getAllUsers,
  getAllCustomers,
  getAllOwners,
  getUserStatistics,
};

export default userService;
