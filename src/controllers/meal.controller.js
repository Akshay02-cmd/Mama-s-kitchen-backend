import { StatusCodes } from "http-status-codes";
import { mealService, messService } from "../services/index.js";
import { BadRequestError, ForbiddenError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

const createMeal = catchAsync(async (req, res) => {
  // Get messId from request body (should be provided by frontend)
  // Or get from owner's mess if they only have one mess
  const { messId } = req.body;
  
  if (!messId) {
    // If messId not provided, try to get owner's first mess
    const ownerMesses = await messService.getMessesByOwnerId(req.user.userId);
    
    if (!ownerMesses || ownerMesses.length === 0) {
      throw new BadRequestError("Owner must have a mess before creating meals");
    }
    
    // Use the first mess if multiple exist
    const messIdToUse = ownerMesses[0]._id.toString();
    const meal = await mealService.createMeal(messIdToUse, req.body);
    res.status(StatusCodes.CREATED).json({ meal });
  } else {
    // Verify the mess belongs to the owner
    const isOwner = await messService.verifyMessOwnership(messId, req.user.userId);
    
    if (!isOwner) {
      throw new ForbiddenError("You can only create meals for your own mess");
    }
    
    const meal = await mealService.createMeal(messId, req.body);
    res.status(StatusCodes.CREATED).json({ meal });
  }
});

const getMeal = catchAsync(async (req, res) => {
  const { mealid } = req.params;
  const meal = await mealService.getMealById(mealid);
  res.status(StatusCodes.OK).json({ meal });
});

const updateMeal = catchAsync(async (req, res) => {
  const { mealid } = req.params;
  const meal = await mealService.updateMeal(mealid, req.body);
  res.status(StatusCodes.OK).json({ meal });
});

const getallMeals = catchAsync(async (req, res) => {
  const filters = req.query;
  const meals = await mealService.getAllMeals(filters);
  res.status(StatusCodes.OK).json({ meal: meals });
});

const deleteMeal = catchAsync(async (req, res) => {
  const { mealid } = req.params;
  const meal = await mealService.deleteMeal(mealid);
  res.status(StatusCodes.OK).json({ meal });
});

export { createMeal, getMeal, updateMeal, deleteMeal, getallMeals };