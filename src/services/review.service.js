/**
 * @fileoverview Review Service
 * @module services/review.service
 * @description Business logic for review operations
 */

import Review from "../model/review.model.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../errors/index.js";

/**
 * Create a new review
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.user - User ID
 * @param {string} reviewData.mess - Mess ID
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} [reviewData.comment] - Review comment
 * @returns {Promise<Object>} Created review object
 * @throws {BadRequestError} If review creation fails
 */
export const createReview = async (reviewData) => {
  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new BadRequestError("Rating must be between 1 and 5");
  }

  const review = await Review.create(reviewData);

  if (!review) {
    throw new BadRequestError("Invalid review data");
  }

  return review;
};

/**
 * Get all reviews
 * @param {Object} filters - Filter options
 * @param {string} [filters.mess] - Filter by mess ID
 * @param {string} [filters.user] - Filter by user ID
 * @returns {Promise<Array>} Array of review objects
 * @throws {NotFoundError} If no reviews found
 */
export const getAllReviews = async (filters = {}) => {
  const queryObject = {};

  if (filters.mess) {
    queryObject.mess = filters.mess;
  }

  if (filters.user) {
    queryObject.user = filters.user;
  }

  const reviews = await Review.find(queryObject)
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });

  if (!reviews || reviews.length === 0) {
    throw new NotFoundError("No reviews found");
  }

  return reviews;
};

/**
 * Get review by ID
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Review object
 * @throws {NotFoundError} If review not found
 */
export const getReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId)
    .populate("user", "name email")
    .populate("mess", "name area");

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  return review;
};

/**
 * Update review
 * @param {string} reviewId - Review ID
 * @param {string} userId - User ID (for ownership verification)
 * @param {Object} updateData - Update data
 * @param {number} [updateData.rating] - Updated rating
 * @param {string} [updateData.comment] - Updated comment
 * @returns {Promise<Object>} Updated review object
 * @throws {NotFoundError} If review not found
 * @throws {ForbiddenError} If user doesn't own the review
 */
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

  const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user", "name email")
    .populate("mess", "name area");

  return updatedReview;
};

/**
 * Delete review
 * @param {string} reviewId - Review ID
 * @param {string} userId - User ID (for ownership verification)
 * @returns {Promise<Object>} Deleted review object
 * @throws {NotFoundError} If review not found
 * @throws {ForbiddenError} If user doesn't own the review
 */
export const deleteReview = async (reviewId, userId) => {
  // Verify ownership
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.user.toString() !== userId.toString()) {
    throw new ForbiddenError("You can only delete your own reviews");
  }

  const deletedReview = await Review.findByIdAndDelete(reviewId);

  return deletedReview;
};

/**
 * Get reviews for a specific mess
 * @param {string} messId - Mess ID
 * @returns {Promise<Array>} Array of reviews for the mess
 */
export const getReviewsByMessId = async (messId) => {
  const reviews = await Review.find({ mess: messId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return reviews;
};

/**
 * Get average rating for a mess
 * @param {string} messId - Mess ID
 * @returns {Promise<Object>} Average rating and count
 */
export const getMessAverageRating = async (messId) => {
  const result = await Review.aggregate([
    { $match: { mess: messId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  }

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: result[0].totalReviews,
  };
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
