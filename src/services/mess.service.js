/**
 * @fileoverview Mess Service
 * @module services/mess.service
 * @description Business logic for mess/catering service operations
 */

import Mess from "../model/Mess.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

/**
 * Create a new mess
 * @param {string} ownerId - Owner user ID
 * @param {Object} messData - Mess data
 * @param {string} messData.name - Mess name
 * @param {string} messData.area - Area/location
 * @param {string} messData.phone - Contact phone
 * @param {string} messData.address - Full address
 * @param {string} messData.description - Description
 * @returns {Promise<Object>} Created mess object
 * @throws {BadRequestError} If mess creation fails
 */
export const createMess = async (ownerId, messData) => {
  const mess = await Mess.create({
    ownerId,
    ...messData,
  });

  if (!mess) {
    throw new BadRequestError("Unable to create mess");
  }

  return mess;
};

/**
 * Get mess by ID
 * @param {string} messId - Mess ID
 * @returns {Promise<Object>} Mess object
 * @throws {NotFoundError} If mess not found
 */
export const getMessById = async (messId) => {
  if (!messId) {
    throw new NotFoundError("Mess ID is required");
  }

  const mess = await Mess.findById(messId).populate("ownerId", "name email");

  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess;
};

/**
 * Get all messes with optional filters
 * @param {Object} filters - Filter options
 * @param {string} [filters.area] - Filter by area
 * @param {string} [filters.search] - Search in name and description
 * @param {boolean} [filters.is_Active] - Filter by active status
 * @returns {Promise<Array>} Array of mess objects
 * @throws {NotFoundError} If no messes found
 */
export const getAllMesses = async (filters = {}) => {
  const { area, search, is_Active } = filters;
  const queryObject = {};

  // Filter by area
  if (area) {
    queryObject.area = { $regex: area, $options: "i" };
  }

  // Search in name and description
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by active status
  if (is_Active !== undefined) {
    queryObject.is_Active = is_Active === "true" || is_Active === true;
  }

  const messes = await Mess.find(queryObject)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });

  if (!messes || messes.length === 0) {
    throw new NotFoundError("No messes found");
  }

  return messes;
};

/**
 * Update mess
 * @param {string} messId - Mess ID
 * @param {Object} updateData - Update data
 * @param {string} [updateData.name] - Mess name
 * @param {string} [updateData.area] - Area/location
 * @param {string} [updateData.phone] - Contact phone
 * @param {string} [updateData.address] - Full address
 * @param {string} [updateData.description] - Description
 * @param {boolean} [updateData.is_Active] - Active status
 * @returns {Promise<Object>} Updated mess object
 * @throws {NotFoundError} If mess not found
 */
export const updateMess = async (messId, updateData) => {
  const mess = await Mess.findByIdAndUpdate(messId, updateData, {
    new: true,
    runValidators: true,
  }).populate("ownerId", "name email");

  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess;
};

/**
 * Delete mess
 * @param {string} messId - Mess ID
 * @returns {Promise<Object>} Deleted mess object
 * @throws {NotFoundError} If mess not found
 */
export const deleteMess = async (messId) => {
  const mess = await Mess.findByIdAndDelete(messId);

  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess;
};

/**
 * Get messes by owner ID
 * @param {string} ownerId - Owner user ID
 * @returns {Promise<Array>} Array of mess objects
 */
export const getMessesByOwnerId = async (ownerId) => {
  const messes = await Mess.find({ ownerId })
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });

  return messes;
};

/**
 * Verify mess ownership
 * @param {string} messId - Mess ID
 * @param {string} ownerId - Owner user ID
 * @returns {Promise<boolean>} True if owner owns the mess
 * @throws {NotFoundError} If mess not found
 */
export const verifyMessOwnership = async (messId, ownerId) => {
  const mess = await Mess.findById(messId);
  
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  return mess.ownerId.toString() === ownerId.toString();
};

const messService = {
  createMess,
  getMessById,
  getAllMesses,
  updateMess,
  deleteMess,
  getMessesByOwnerId,
  verifyMessOwnership,
};

export default messService;
