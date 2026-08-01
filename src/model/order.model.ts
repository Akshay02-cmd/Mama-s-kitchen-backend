import mongoose from "mongoose";

interface IOrderItem {
  mealId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  selectedExtras?: {
    extraId: mongoose.Types.ObjectId;
    name: string;
    price: number;
  }[];
}

interface IOrder {
  userId: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryPhone: string;
  status: "PLACED" | "PREPARING" | "DELIVERED" | "CANCELLED";
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "COD";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  paymentId?: string;
  notes?: string;
  deliveryTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema: mongoose.Schema<IOrder> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
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
        selectedExtras: [
          {
            extraId: mongoose.Schema.Types.ObjectId,
            name: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
          },
        ],
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
    deliveryTime: Date,
  },
  { timestamps: true },
);

const Order: mongoose.Model<IOrder> = mongoose.model("Order", OrderSchema);
export default Order;
