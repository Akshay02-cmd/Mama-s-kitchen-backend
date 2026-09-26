import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middelware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  reviewSchema,
  reviewUpdateSchema,
} from "../validators/review.validators.js";
import {
  createreview,
  getAllReviews,
  getReviewById,
  updatereview,
  deletereview,
} from "../controllers/review.controller.js";

const router = express.Router();

router
  .route("/")
  .get(auth, authorizeRoles("ADMIN", "OWNER", "CUSTOMER"), getAllReviews)
  .post(auth, authorizeRoles("CUSTOMER"), validate(reviewSchema), createreview);

router
  .route("/:id")
  .get(auth, authorizeRoles("ADMIN", "OWNER", "CUSTOMER"), getReviewById)
  .put(
    auth,
    authorizeRoles("CUSTOMER"),
    validate(reviewUpdateSchema),
    updatereview,
  )
  .delete(auth, authorizeRoles("CUSTOMER"), deletereview);

export default router;
