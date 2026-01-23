import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middelware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  CustomerSchema,
  OwnerSchema,
  UpdateProfileSchema,
} from "../validators/profile.validators.js";
import {
  CreateProfileCustomer,
  UpdateProfileCustomer,
  GetProfileCustomer,
  CreateProfileOwner,
  UpdateProfileOwner,
  GetProfileOwner,
} from "../controllers/profile.contorllers.js";

const router = express.Router();

router // for individual customer profile routes
  .route("/customer")
  .get(auth, authorizeRoles("CUSTOMER","OWNER"),GetProfileCustomer) 
  .post(auth, authorizeRoles("CUSTOMER"),validate(CustomerSchema),CreateProfileCustomer)
  .put(auth,authorizeRoles("CUSTOMER"),validate(UpdateProfileSchema),UpdateProfileCustomer);

router // for individual mess owner profile routes
  .route("/owner")
  .get(auth, authorizeRoles("CUSTOMER","OWNER"),GetProfileOwner)
  .post(auth, authorizeRoles("OWNER"),validate(OwnerSchema),CreateProfileOwner)
  .put(auth, authorizeRoles("OWNER"),validate(UpdateProfileSchema), UpdateProfileOwner);

export default router;
