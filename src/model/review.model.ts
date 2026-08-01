import mongoose from "mongoose";

interface IReview {
  user: mongoose.Types.ObjectId;
  mess: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema: mongoose.Schema<IReview> = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mess: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true },
);

const Review: mongoose.Model<IReview> = mongoose.model("Review", reviewSchema);

export default Review;
 