import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Meal",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PLACED", "PREPARING", "DELIVERED", "CANCELLED"],
      default: "PLACED",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "DEBIT_CARD", "UPI", "COD"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
      required: true,
    },
    paymentId: String,
    notes: {
      type: String,
      maxlength: 500,
    },
    deliverytime: Date,
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
