import express from "express";
import validate from "../middlewares/validate.js";
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
  .get(getallMesses)
  .post(auth, authorizeRoles("OWNER"), validate(MessSchema), createMess);

router
  .route("/:messid")
  .get(getMess)
  .put(auth, authorizeRoles("OWNER"), validate(UpdateMessSchema), updateMess)
  .delete(auth, authorizeRoles("OWNER"), deleteMess);

router
  .route("/:messid/meals")
  .get(getallMeals)
  .post(auth, authorizeRoles("OWNER"), validate(MealSchema), createMeal);

router
  .route("/:messid/meals/:mealId")
  .get(getMeal)
  .put(auth, authorizeRoles("OWNER"), validate(UpdateMealSchema), updateMeal)
  .delete(auth, authorizeRoles("OWNER"), deleteMeal);
export default router;
