import ReviewModel from "../../model/review.model.js";

const ReviewCreate = async (reviewData) => {
  return ReviewModel.create(reviewData);
};

const ReviewAll = async (filters = {}) => {
  return ReviewModel.find(filters)
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });
};

const ReviewFindById = async (reviewId) => {
  return ReviewModel.findById(reviewId)
    .populate("user", "name email")
    .populate("mess", "name area");
};

const ReviewUpdate = async (reviewId, updateData) => {
  return ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true })
    .populate("user", "name email")
    .populate("mess", "name area");
};

const ReviewDelete = async (reviewId) => {
  return ReviewModel.findByIdAndDelete(reviewId)
    .populate("user", "name email")
    .populate("mess", "name area");
};

const ReviewFindByUserId = async (userId) => {
  return ReviewModel.find({ user: userId })
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });
};

const ReviewFindByMessId = async (messId) => {
  return ReviewModel.find({ mess: messId })
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });
};

const ReviewAverageRating = async (messId) => {
  return ReviewModel.aggregate([
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
};

const Review = {
  create: ReviewCreate,
  findById: ReviewFindById,
  update: ReviewUpdate,
  delete: ReviewDelete,
  findAll: ReviewAll,
  findByUserId: ReviewFindByUserId,
  findByMessId: ReviewFindByMessId,
  getAverageRating: ReviewAverageRating,
};

export default Review;
