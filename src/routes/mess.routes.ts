import express from "express";
import validate from "../middleware/validator.middelware.js";
import auth from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import { UpdateMessSchema } from "../validators/profile.validators.js";
import { getMess, updateMess, getallMesses } from "../controllers/mess.controller.js";
import {
  getMessMeals,
  getMessOrders,
  getMessStats,
} from "../controllers/owner.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getallMesses); // Public access to view the configured mess

router
  .route("/:id")
  .get(getMess) // Public access to view mess details
  .put(auth, authorizeRoles("OWNER"), validate(UpdateMessSchema), updateMess);

// Mess-specific routes
router.get("/:messId/meals", getMessMeals); // Public access to view mess meals
router.get("/:messId/orders", auth, authorizeRoles("OWNER"), getMessOrders); // Owner only
router.get("/:messId/stats", auth, authorizeRoles("OWNER"), getMessStats); // Owner only

export default router;
