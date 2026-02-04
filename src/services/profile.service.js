/**
 * @fileoverview Profile Service
 * @module services/profile.service
 * @description Business logic for customer and owner profile operations
 */

import CustomerProfile from "../model/CustomerProfile.model.js";
import OwnerProfile from "../model/OwnerProfile.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// ==================== Customer Profile ====================

/**
 * Create customer profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @param {string} profileData.phone - Phone number
 * @param {string} profileData.address - Delivery address
 * @returns {Promise<Object>} Created customer profile
 * @throws {BadRequestError} If profile creation fails
 */
export const createCustomerProfile = async (userId, profileData) => {
  // Check if profile already exists
  const existingProfile = await CustomerProfile.findOne({ userId });
  if (existingProfile) {
    throw new BadRequestError("Customer profile already exists");
  }

  const profile = await CustomerProfile.create({
    userId,
    ...profileData,
  });

  if (!profile) {
    throw new BadRequestError("Unable to create customer profile");
  }

  return profile;
};

/**
 * Get customer profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Customer profile
 * @throws {NotFoundError} If profile not found
 */
export const getCustomerProfile = async (userId) => {
  const profile = await CustomerProfile.findOne({ userId })
    .populate("userId", "name email role");

  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }

  return profile;
};

/**
 * Update customer profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @param {string} [updateData.phone] - Phone number
 * @param {string} [updateData.address] - Delivery address
 * @returns {Promise<Object>} Updated customer profile
 * @throws {NotFoundError} If profile not found
 */
export const updateCustomerProfile = async (userId, updateData) => {
  const profile = await CustomerProfile.findOneAndUpdate(
    { userId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("userId", "name email role");

  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }

  return profile;
};

// ==================== Owner Profile ====================

/**
 * Create owner profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @param {string} profileData.phone - Phone number
 * @param {string} profileData.address - Business address
 * @returns {Promise<Object>} Created owner profile
 * @throws {BadRequestError} If profile creation fails
 */
export const createOwnerProfile = async (userId, profileData) => {
  // Check if profile already exists
  const existingProfile = await OwnerProfile.findOne({ userId });
  if (existingProfile) {
    throw new BadRequestError("Owner profile already exists");
  }

  const profile = await OwnerProfile.create({
    userId,
    ...profileData,
  });

  if (!profile) {
    throw new BadRequestError("Unable to create owner profile");
  }

  return profile;
};

/**
 * Get owner profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Owner profile
 * @throws {NotFoundError} If profile not found
 */
export const getOwnerProfile = async (userId) => {
  const profile = await OwnerProfile.findOne({ userId })
    .populate("userId", "name email role");

  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }

  return profile;
};

/**
 * Update owner profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @param {string} [updateData.phone] - Phone number
 * @param {string} [updateData.address] - Business address
 * @returns {Promise<Object>} Updated owner profile
 * @throws {NotFoundError} If profile not found
 */
export const updateOwnerProfile = async (userId, updateData) => {
  const profile = await OwnerProfile.findOneAndUpdate(
    { userId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("userId", "name email role");

  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }

  return profile;
};

const profileService = {
  // Customer
  createCustomerProfile,
  getCustomerProfile,
  updateCustomerProfile,
  // Owner
  createOwnerProfile,
  getOwnerProfile,
  updateOwnerProfile,
};

export default profileService;
