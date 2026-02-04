/**
 * @fileoverview Meal Service
 * @module services/meal.service
 * @description Business logic for meal/menu operations
 */

import Meal from "../model/Meal.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

/**
 * Create a new meal
 * @param {string} messId - Mess ID
 * @param {Object} mealData - Meal data
 * @param {string} mealData.name - Meal name
 * @param {string} mealData.mealType - Meal type (breakfast, lunch, dinner, snack)
 * @param {boolean} mealData.is_Veg - Whether meal is vegetarian
 * @param {string} mealData.description - Meal description
 * @param {number} mealData.price - Meal price
 * @param {boolean} mealData.is_Available - Availability status
 * @returns {Promise<Object>} Created meal object
 * @throws {BadRequestError} If meal creation fails
 */
export const createMeal = async (messId, mealData) => {
  const meal = await Meal.create({
    messId,
    ...mealData,
  });

  if (!meal) {
    throw new BadRequestError("Unable to create meal");
  }

  return meal;
};

/**
 * Get meal by ID
 * @param {string} mealId - Meal ID
 * @returns {Promise<Object>} Meal object
 * @throws {NotFoundError} If meal not found
 */
export const getMealById = async (mealId) => {
  const meal = await Meal.findById(mealId).populate("messId", "name area");

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  return meal;
};

/**
 * Get all meals with optional filters
 * @param {Object} filters - Filter options
 * @param {string} [filters.messId] - Filter by mess ID
 * @param {string} [filters.mealType] - Filter by meal type
 * @param {boolean} [filters.is_Veg] - Filter by vegetarian status
 * @param {boolean} [filters.is_Available] - Filter by availability
 * @returns {Promise<Array>} Array of meal objects
 * @throws {NotFoundError} If no meals found
 */
export const getAllMeals = async (filters = {}) => {
  const { messId, mealType, is_Veg, is_Available } = filters;
  const queryObject = {};

  if (messId) {
    queryObject.messId = messId;
  }

  if (mealType) {
    queryObject.mealType = mealType;
  }

  if (is_Veg !== undefined) {
    queryObject.is_Veg = is_Veg === "true" || is_Veg === true;
  }

  if (is_Available !== undefined) {
    queryObject.is_Available = is_Available === "true" || is_Available === true;
  }

  const meals = await Meal.find(queryObject)
    .populate("messId", "name area address")
    .sort({ createdAt: -1 });

  // Return empty array if no meals found instead of throwing error
  // This allows the frontend to show "No meals available" message
  return meals || [];
};

/**
 * Get meals by mess ID
 * @param {string} messId - Mess ID
 * @returns {Promise<Array>} Array of meal objects
 */
export const getMealsByMessId = async (messId) => {
  const meals = await Meal.find({ messId })
    .populate("messId", "name area")
    .sort({ createdAt: -1 });

  return meals;
};

/**
 * Update meal
 * @param {string} mealId - Meal ID
 * @param {Object} updateData - Update data
 * @param {string} [updateData.name] - Meal name
 * @param {string} [updateData.mealType] - Meal type
 * @param {boolean} [updateData.is_Veg] - Vegetarian status
 * @param {string} [updateData.description] - Meal description
 * @param {number} [updateData.price] - Meal price
 * @param {boolean} [updateData.is_Available] - Availability status
 * @returns {Promise<Object>} Updated meal object
 * @throws {NotFoundError} If meal not found
 */
export const updateMeal = async (mealId, updateData) => {
  const meal = await Meal.findByIdAndUpdate(mealId, updateData, {
    new: true,
    runValidators: true,
  }).populate("messId", "name area");

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  return meal;
};

/**
 * Delete meal
 * @param {string} mealId - Meal ID
 * @returns {Promise<Object>} Deleted meal object
 * @throws {NotFoundError} If meal not found
 */
export const deleteMeal = async (mealId) => {
  const meal = await Meal.findByIdAndDelete(mealId);

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  return meal;
};

/**
 * Verify meal belongs to mess
 * @param {string} mealId - Meal ID
 * @param {string} messId - Mess ID
 * @returns {Promise<boolean>} True if meal belongs to mess
 * @throws {NotFoundError} If meal not found
 */
export const verifyMealOwnership = async (mealId, messId) => {
  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  return meal.messId.toString() === messId.toString();
};

/**
 * Check if meal is available
 * @param {string} mealId - Meal ID
 * @returns {Promise<boolean>} True if meal is available
 * @throws {NotFoundError} If meal not found
 */
export const isMealAvailable = async (mealId) => {
  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  return meal.is_Available === true;
};

const mealService = {
  createMeal,
  getMealById,
  getAllMeals,
  getMealsByMessId,
  updateMeal,
  deleteMeal,
  verifyMealOwnership,
  isMealAvailable,
};

export default mealService;
