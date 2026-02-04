import express from "express";
import validate from "../middleware/validator.middelware.js";
import auth from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  MessSchema,
  UpdateMessSchema,
} from "../validators/profile.validators.js";
import {
  getMess,
  createMess,
  updateMess,
  deleteMess,
  getallMesses,
} from "../controllers/mess.controller.js";

const router = express.Router();
router
  .route("/")
  .get(getallMesses) // Public access to view all messes
  .post(auth, authorizeRoles("OWNER"), validate(MessSchema), createMess);

router
  .route("/:id")
  .get(getMess) // Public access to view mess details
  .put(auth, authorizeRoles("OWNER"), validate(UpdateMessSchema), updateMess)
  .delete(auth, authorizeRoles("OWNER"), deleteMess);

export default router;
