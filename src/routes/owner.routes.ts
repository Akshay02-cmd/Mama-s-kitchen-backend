/**
 * @fileoverview Owner Routes
 * @module routes/owner
 * @description Routes for owner dashboard and analytics
 */

import express from "express";
import auth from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  getOwnerDashboardStats,
  getOwnerMesses,
} from "../controllers/owner.controller.js";

const router = express.Router();

// Owner dashboard statistics
router.get(
  "/dashboard/stats",
  auth,
  authorizeRoles("OWNER"),
  getOwnerDashboardStats
);

// Get all messes owned by logged-in owner
router.get(
  "/messes",
  auth,
  authorizeRoles("OWNER"),
  getOwnerMesses
);

export default router;
