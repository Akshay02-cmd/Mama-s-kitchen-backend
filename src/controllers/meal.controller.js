import { StatusCodes } from "http-status-codes";
import MEAL from "../model/Meal.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

const createMeal = catchAsync(async (req, res) => {
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
});

const getMeal = catchAsync(async (req, res) => {
  const { mealid } = req.params;
  const meal = await MEAL.findById(mealid);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
});

const updateMeal = catchAsync(async (req, res) => {
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
});

const getallMeals = catchAsync(async (req, res) => {
  const meal = await MEAL.find({});
  if(!meal){
    throw new NotFoundError('No meal found')
  }
  res.status(StatusCodes.OK).json({ meal });
});

const deleteMeal = catchAsync(async (req, res) => {
  const { mealid } = req.params;
  const meal = await MEAL.findByIdAndDelete(mealid);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
});

export { createMeal, getMeal, updateMeal, deleteMeal, getallMeals };