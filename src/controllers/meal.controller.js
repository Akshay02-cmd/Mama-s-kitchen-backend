import { StatusCodes } from "http-status-codes";
import MEAL from "../model/Meal.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const createMeal = (req, res) => {
  const { messid } = req.params;
  const { name, mealType, is_Veg, description, price, is_Available } = req.body;

  const meal = MEAL.create({
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
const getMeal = (req, res) => {
  const { mealid } = req.params;
  const meal = MEAL.findById(mealid);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
};

const updateMeal = (req, res) => {
  const { mealid } = req.params;
  const { name, mealType, is_Veg, description, price, is_Available } = req.body;
  const meal = MEAL.findByIdAndUpdate(
    mealid,
    { name, mealType, is_Veg, description, price, is_Available }, 
    { new: true, runValidators: true }
  );
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
};

const getallMeals = (req, res) => {
  const meal = MEAL.find({});
  if(!meal){
    throw new NotFoundError('No meal found')
  }
  res.send("All meals");
};

const deleteMeal = (req, res) => {
  const { mealid } = req.params;
  const meal = MEAL.findByIdAndDelete(mealid);
  if (!meal) {
    throw new NotFoundError("Meal not found");
  }
  res.status(StatusCodes.OK).json({ meal });
};

export { createMeal, getMeal, updateMeal, deleteMeal, getallMeals };