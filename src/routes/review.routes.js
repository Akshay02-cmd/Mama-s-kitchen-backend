import express from "express";
import {
  createreview,
  getAllReviews,
  getReviewById,
  updatereview,
  deletereview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.route("/").get(getAllReviews).post(createreview);

router.route("/:id").get(getReviewById).put(updatereview).delete(deletereview);

export default router;
