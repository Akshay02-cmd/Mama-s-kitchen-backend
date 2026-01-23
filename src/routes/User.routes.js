import express from "express";
const router = express.Router();
import {
  getallUsers,
  getallCustomers,
  getallOwners,
} from "../controllers/User.controller.js";

router.get("/", getallUsers);
router.get("/customers", getallCustomers);
router.get("/owners", getallOwners);

export default router;
