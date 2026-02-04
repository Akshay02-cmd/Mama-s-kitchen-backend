/**
 * @fileoverview User Service
 * @module services/user.service
 * @description Business logic for user management operations
 */

import User from "../model/user.model.js";
import CustomerProfile from "../model/CustomerProfile.model.js";
import OwnerProfile from "../model/OwnerProfile.model.js";
import { NotFoundError } from "../errors/index.js";

/**
 * Get all users
 * @returns {Promise<Array>} Array of user objects
 * @throws {NotFoundError} If no users found
 */
export const getAllUsers = async () => {
  const users = await User.find({}).select("-password");
  
  if (!users || users.length === 0) {
    throw new NotFoundError("No users found");
  }

  return users;
};

/**
 * Get all customers
 * @returns {Promise<Array>} Array of customer profiles
 * @throws {NotFoundError} If no customers found
 */
export const getAllCustomers = async () => {
  const customers = await CustomerProfile.find({})
    .populate("userId", "name email role")
    .select("-__v");

  if (!customers || customers.length === 0) {
    throw new NotFoundError("No customers found");
  }

  return customers;
};

/**
 * Get all owners
 * @returns {Promise<Array>} Array of owner profiles
 * @throws {NotFoundError} If no owners found
 */
export const getAllOwners = async () => {
  const owners = await OwnerProfile.find({})
    .populate("userId", "name email role")
    .select("-__v");

  if (!owners || owners.length === 0) {
    throw new NotFoundError("No owners found");
  }

  return owners;
};

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 */
export const getUserStatistics = async () => {
  const [totalUsers, totalCustomers, totalOwners] = await Promise.all([
    User.countDocuments({}),
    CustomerProfile.countDocuments({}),
    OwnerProfile.countDocuments({}),
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
