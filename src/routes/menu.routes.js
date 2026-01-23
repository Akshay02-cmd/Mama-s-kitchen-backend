import express from "express";
import validate from "../middleware/validator.middelware.js";
import auth from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";

import {
  MessSchema,
  UpdateMessSchema,
} from "../validators/profile.validators.js";
import { MealSchema, UpdateMealSchema } from "../validators/meal.validator.js";

import {
  getMess,
  createMess,
  updateMess,
  deleteMess,
  getallMesses,
} from "../controllers/mess.controller.js";
import {
  createMeal,
  getMeal,
  updateMeal,
  getallMeals,
  deleteMeal,
} from "../controllers/meal.controller.js";

const router = express.Router();

router
  .route("/")
  .get(auth, authorizeRoles("OWNER", "CUSTOMER"), getallMeals);

router
  .route("/:mealId")
  .get(auth, authorizeRoles("OWNER", "CUSTOMER"), getMeal)
  .post(
    auth,
    authorizeRoles("OWNER"),
    validate(MealSchema),
    createMeal,
  )
  .put(
    auth,
    authorizeRoles("OWNER"),
    validate(UpdateMealSchema),
    updateMeal,
  )
  .delete(auth, authorizeRoles("OWNER"), deleteMeal);

export default router;
