import Review from "../../repository/User/Review.repo.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../errors/index.js";

export const createReview = async (reviewData) => {
  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new BadRequestError("Rating must be between 1 and 5");
  }

  const review = await Review.create(reviewData);

  if (!review) {
    throw new BadRequestError("Invalid review data");
  }

  const populatedReview = await Review.findById(review._id);

  return populatedReview;
};

export const getAllReviews = async (filters: any = {}) => {
  const queryObject: any = {};
  if (filters.mess) {
    queryObject.mess = filters.mess;
  }
  if (filters.user) {
    queryObject.user = filters.user;
  }
  const reviews = await Review.findAll(queryObject);
  if (!reviews || reviews.length === 0) {
    throw new NotFoundError("No reviews found");
  }
  return reviews;
};

export const getReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  return review;
};

export const updateReview = async (reviewId, userId, updateData) => {
  // Verify ownership
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.user.toString() !== userId.toString()) {
    throw new ForbiddenError("You can only update your own reviews");
  }

  // Validate rating if provided
  if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
    throw new BadRequestError("Rating must be between 1 and 5");
  }

  const updatedReview = await Review.update(reviewId, updateData);

  return updatedReview;
};

export const deleteReview = async (reviewId, userId) => {
  // Verify ownership
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.user.toString() !== userId.toString()) {
    throw new ForbiddenError("You can only delete your own reviews");
  }

  const deletedReview = await Review.delete(reviewId);

  return deletedReview;
};

export const getReviewsByMessId = async (messId) => {
  const reviews = await Review.findByMessId(messId);
  return reviews;
};

export const getMessAverageRating = async (messId) => {
  const result = await Review.getAverageRating(messId);
  return result;
};

const reviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByMessId,
  getMessAverageRating,
};

export default reviewService;
