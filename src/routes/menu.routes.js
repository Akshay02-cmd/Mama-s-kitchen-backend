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
  .get(auth, authorizeRoles("ADMIN", "OWNER", "CUSTOMER"), getallMeals);

router
  .route("/:mealId")
  .get(auth, authorizeRoles("ADMIN", "OWNER", "CUSTOMER"), getMeal)
  .post(
    auth,
    authorizeRoles("ADMIN", "OWNER"),
    validate(MealSchema),
    createMeal,
  )
  .put(
    auth,
    authorizeRoles("ADMIN", "OWNER"),
    validate(UpdateMealSchema),
    updateMeal,
  )
  .delete(auth, authorizeRoles("ADMIN", "OWNER"), deleteMeal);

router
  .route("/messes")
  .get(auth, authorizeRoles("ADMIN", "OWNER"), getallMesses)
  .post(
    auth,
    authorizeRoles("ADMIN", "OWNER"),
    validate(MessSchema),
    createMess,
  );

router
  .route("/messes/:messId")
  .get(auth, authorizeRoles("ADMIN", "OWNER"), getMess)
  .put(
    auth,
    authorizeRoles("ADMIN", "OWNER"),
    validate(UpdateMessSchema),
    updateMess,
  )
  .delete(auth, authorizeRoles("ADMIN", "OWNER"), deleteMess);
