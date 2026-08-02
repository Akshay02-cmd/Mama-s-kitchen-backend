import { Meal } from "../../repository/index.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

export const createMeal = async (messId: any, mealData: any) => {
  const meal = await Meal.MealCreate(messId, mealData);
  if (!meal) {
    throw new BadRequestError("Unable to create meal");
  }
  return meal;
};

export const getMealById = async (mealId: any) => {
  const meal = await Meal.MealGetById(mealId);

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  return meal;
};

export const getAllMeals = async (filters: any = {}) => {
  const { messId, mealType, is_Veg, is_Available } = filters;
  const queryObject: any = {};
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
  const meals = await Meal.MealGetAll(queryObject);
  return meals || [];
};

export const getMealsByMessId = async (messId: any) => {
  const meals = await Meal.MealGetByMessId(messId);
  if (!meals || meals.length === 0) {
    throw new NotFoundError("No meals found for this mess");
  }
  return meals;
};

export const updateMeal = async (mealId: any, updateData: any) => {
  const meal = await Meal.MealUpdateById(mealId, updateData);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  return meal;
};

export const deleteMeal = async (mealId: any) => {
  const meal = await Meal.MealDeleteById(mealId);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  return meal;
};

export const verifyMealOwnership = async (mealId: any, messId: any) => {
  const meal = await Meal.MealGetById(mealId);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  return meal.messId.toString() === messId.toString();
};

export const isMealAvailable = async (mealId: any) => {
  const meal = await Meal.MealGetById(mealId);
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
