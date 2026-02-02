import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middelware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import contactUsSchema from "../validators/contactus.validators.js";
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  GroupContactUsByUser,
  deleteContactUs,
  deleteAllContactUs,
} from "../controllers/contactus.controllers.js";

const router = express.Router();

router
  .route("/")
  .get(auth, authorizeRoles("ADMIN"), getAllContactUs)
  .post(auth, authorizeRoles("CUSTOMER"), validate(contactUsSchema), createContactUs)
  .delete(auth, authorizeRoles("ADMIN"), deleteAllContactUs);

router
  .route("/groupbyuser")
  .get(auth, authorizeRoles("ADMIN"), GroupContactUsByUser);

router
  .route("/:id")
  .get(auth, authorizeRoles("ADMIN"), getContactUsById)
  .delete(auth, authorizeRoles("ADMIN"), deleteContactUs);


export default router;
