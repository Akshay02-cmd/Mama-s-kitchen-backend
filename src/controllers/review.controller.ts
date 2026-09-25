import { StatusCodes } from "http-status-codes";
import { reviewService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

const createreview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, review });
});

const getAllReviews = catchAsync(async (req, res) => {
  const filters = req.query;
  const reviews = await reviewService.getAllReviews(filters);
  res.status(StatusCodes.OK).json({ success: true, reviews });
});

const getReviewById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await reviewService.getReviewById(id);
  res.status(StatusCodes.OK).json({ success: true, review });
});

const updatereview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await reviewService.updateReview(id, req.user.userId, req.body);
  res.status(StatusCodes.OK).json({ success: true, review });
});

const deletereview = catchAsync(async (req, res) => {
  const { id } = req.params;
  await reviewService.deleteReview(id, req.user.userId);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Review deleted successfully" });
});

export {
  createreview,
  getAllReviews,
  getReviewById,
  updatereview,
  deletereview,
};
