import Review from "../model/review.model.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import catchAsync from "../utils/catchAsync.js";

const createreview = catchAsync(async (req, res) => {
  const review = await Review.create({ ...req.body });
  if (!review) {
    throw new BadRequestError("Invalid review data");
  }
  res.status(StatusCodes.CREATED).json({ success: true, review });
});

const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({});
  if (reviews.length === 0) {
    throw new NotFoundError("No reviews found");
  }
  res.status(StatusCodes.OK).json({ success: true, reviews });
});

const getReviewById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  res.status(StatusCodes.OK).json({ success: true, review });
});

const updatereview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  res.status(StatusCodes.OK).json({ success: true, review });
});

const deletereview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    throw new NotFoundError("Review not found");
  }
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
