import ReviewModel from "../../model/review.model.js";
import mongoose from "mongoose";

export interface IReview {
  user: mongoose.Types.ObjectId;
  mess: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewCreate = async (reviewData: IReview) => {
  return ReviewModel.create(reviewData);
};

const ReviewAll = async (filters = {}) => {
  return ReviewModel.find(filters)
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });
};

const ReviewFindById = async (reviewId: mongoose.Types.ObjectId) => {
  return ReviewModel.findById(reviewId)
    .populate("user", "name email")
    .populate("mess", "name area");
};

const ReviewUpdate = async (reviewId: mongoose.Types.ObjectId, updateData: Partial<IReview>) => {
  return ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true })
    .populate("user", "name email")
    .populate("mess", "name area");
};

const ReviewDelete = async (reviewId: mongoose.Types.ObjectId) => {
  return ReviewModel.findByIdAndDelete(reviewId)
    .populate("user", "name email")
    .populate("mess", "name area");
};

const ReviewFindByUserId = async (userId: mongoose.Types.ObjectId) => {
  return ReviewModel.find({ user: userId })
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });
};

const ReviewFindByMessId = async (messId: mongoose.Types.ObjectId) => {
  return ReviewModel.find({ mess: messId })
    .populate("user", "name email")
    .populate("mess", "name area")
    .sort({ createdAt: -1 });
};

const ReviewAverageRating = async (messId: mongoose.Types.ObjectId) => {
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
