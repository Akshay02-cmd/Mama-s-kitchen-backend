/**
 * @fileoverview Meal management controller for CRUD operations
 * @module controllers/meal.controller
 * @requires http-status-codes
 * @requires ../model/Meal.model
 * @requires ../errors/index
 */

import { StatusCodes } from "http-status-codes";
import MEAL from "../model/Meal.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

/**
 * Create a new meal for a specific mess
 * 
 * @async
 * @function createMeal
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.messid - Mess ID
 * @param {Object} req.body - Meal data
 * @param {string} req.body.name - Meal name
 * @param {string} req.body.mealType - Type (breakfast/lunch/dinner/snack)
 * @param {boolean} req.body.is_Veg - Vegetarian flag
 * @param {string} req.body.description - Meal description
 * @param {number} req.body.price - Price in rupees
 * @param {boolean} req.body.is_Available - Availability status
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with created meal
 * @throws {BadRequestError} If meal creation fails
 */
const createMeal = async (req, res) => {
  const { messid } = req.params;
  const { name, mealType, is_Veg, description, price, is_Available } = req.body;

  const meal = await MEAL.create({
    messId: messid,
    name,
    mealType,
    is_Veg,
    description,
    price,
    is_Available,
  });
  if (!meal) {
    throw new BadRequestError("Unable to create meal");
  }
  res.status(StatusCodes.CREATED).json({ meal });
};
const getMeal = async (req, res) => {
  const { mealid } = req.params;
  const meal = await MEAL.findById(mealid);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
};

const updateMeal = async (req, res) => {
  const { mealid } = req.params;
  const { name, mealType, is_Veg, description, price, is_Available } = req.body;
  const meal = await MEAL.findByIdAndUpdate(
    mealid,
    { name, mealType, is_Veg, description, price, is_Available }, 
    { new: true, runValidators: true }
  );
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
};

const getallMeals = async (req, res) => {
  const meal = await MEAL.find({});
  if(!meal){
    throw new NotFoundError('No meal found')
  }
  res.status(StatusCodes.OK).json({ meal });
};

const deleteMeal = async (req, res) => {
  const { mealid } = req.params;
  const meal = await MEAL.findByIdAndDelete(mealid);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
};

export { createMeal, getMeal, updateMeal, deleteMeal, getallMeals };