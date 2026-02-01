import express from "express";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import contactUSchema from "../validators/contactus.validators.js";
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  GroupContactUsByUser,
  deleteContactUs,
  deleteAllContactUs,
} from "../controllers/contactus.controllers.js";

const router = express.Router();

router.route("/").post(authorizeRoles("customer"), createContactUs).delete(authorizeRoles("ADMIN"), deleteAllContactUs).get(authorizeRoles("ADMIN"), getAllContactUs);
router.route("/:id").get(authorizeRoles("ADMIN"), getContactUsById).delete(authorizeRoles("ADMIN"), deleteContactUs);
router.route("/groupbyuser").get(authorizeRoles("ADMIN"), GroupContactUsByUser);


export default router;
