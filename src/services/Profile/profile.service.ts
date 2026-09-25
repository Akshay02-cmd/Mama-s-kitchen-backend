import { CProfile, OProfile } from "../../repository/index.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

export const createCustomerProfile = async (userId, profileData) => {
  // Check if profile already exists
  const existingProfile = await CProfile.getByUserId(userId);
  if (existingProfile) {
    throw new BadRequestError("Customer profile already exists");
  }

  const profile = await CProfile.create({
    userId,
    ...profileData,
    isProfileCompleted: true, // Mark profile as completed when created
  });

  if (!profile) {
    throw new BadRequestError("Unable to create customer profile");
  }

  return profile;
};

export const getCustomerProfile = async (userId) => {
  const profile = await CProfile.getByUserId(userId);

  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }

  // Auto-fix: If profile has phone and address but isProfileCompleted is false, update it
  if (profile.phone && profile.address && !profile.isProfileCompleted) {
    profile.isProfileCompleted = true;
    await profile.save();
  }

  return profile;
};

export const updateCustomerProfile = async (userId, updateData) => {
  const profile = await CProfile.update(userId, updateData);
  if (!profile) {
    throw new NotFoundError("Customer profile not found");
  }
  return profile;
};

export const createOwnerProfile = async (userId, profileData) => {
  // Check if profile already exists
  const existingProfile = await OProfile.getByUserId(userId);
  if (existingProfile) {
    throw new BadRequestError("Owner profile already exists");
  }

  const profile = await OProfile.create({
    userId,
    ...profileData,
    isProfileCompleted: true, // Mark profile as completed when created
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
  const profile = await OProfile.getByUserId(userId);

  if (!profile) {
    throw new NotFoundError("Owner profile not found");
  }

  // Auto-fix: If profile has phone and address but isProfileCompleted is false, update it
  if (profile.phone && profile.address && !profile.isProfileCompleted) {
    profile.isProfileCompleted = true;
    await profile.save();
  }

  return profile;
};

export const updateOwnerProfile = async (userId, updateData) => {
  const profile = await OProfile.update(userId, {
    ...updateData,
    isProfileCompleted: true,
  }); // Mark profile as completed when updated

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
