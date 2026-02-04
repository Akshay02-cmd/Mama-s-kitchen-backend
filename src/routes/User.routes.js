import express from "express";
import auth from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  getallUsers,
  getallCustomers,
  getallOwners,
} from "../controllers/User.controller.js";

const router = express.Router();

// All user routes require ADMIN authentication
router.get("/", auth, authorizeRoles("ADMIN"), getallUsers);
router.get("/customers", auth, authorizeRoles("ADMIN"), getallCustomers);
router.get("/owners", auth, authorizeRoles("ADMIN"), getallOwners);

export default router;
