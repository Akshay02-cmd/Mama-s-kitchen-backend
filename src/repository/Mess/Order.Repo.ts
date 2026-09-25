import order from "../../model/order.model.js";
import Meal from "../../model/Meal.model.js";
import mongoose from "mongoose";

export type OrderStatus = "PLACED" | "PREPARING" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "COD";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface IOrder {
  userId: mongoose.Types.ObjectId;
  orderItems: {
    mealId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryPhone: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId: string;
  notes: string;
  deliveryTime: Date;
}

class Order {
  async Ordercreate(userId: mongoose.Types.ObjectId, orderData: Omit<IOrder, "userId">) {
    const {
      orderItems,
      totalAmount,
      deliveryAddress,
      deliveryPhone,
      status = "PLACED",
      paymentMethod,
      paymentStatus = "PENDING",
      paymentId,
      notes,
      deliveryTime,
    } = orderData;

    return await order.create({
      userId,
      orderItems,
      totalAmount,
      deliveryAddress,
      deliveryPhone,
      status,
      paymentMethod,
      paymentStatus,
      paymentId,
      notes,
      deliveryTime,
    });
  }

  async OrderGetById(orderId: mongoose.Types.ObjectId) {
    return await order
      .findById(orderId)
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available");
  }

  async OrderGetAll() {
    return await order
      .find({})
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderUpdateById(orderId: mongoose.Types.ObjectId, updateData: Partial<IOrder>) {
    return await order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async OrderByUserId(userId: mongoose.Types.ObjectId) {
    return await order
      .find({ userId })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderCount(filters = {}) {
    return await order.countDocuments(filters);
  }

  async OrderUpdateStatusById(orderId: mongoose.Types.ObjectId, updateData: Partial<IOrder>) {
    return await order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async OrderDeleteById(orderId: mongoose.Types.ObjectId) {
    return await order.findByIdAndDelete(orderId);
  }

  async OrderDeleteByUserId(userId: mongoose.Types.ObjectId) {
    return await order.deleteMany({ userId });
  }

  async OrderDeleteAll() {
    return await order.deleteMany({});
  }

  async OrderByStatus(status: OrderStatus) {
    return await order
      .find({ status })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderWithinDateRange(startDate: Date, endDate: Date) {
    return await order
      .find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async MealgetTotalSales() {
    return await order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);
  }

  async MealgetMonthlySales() {
    return await order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async MealgetTopSelling(limit = 5) {
    return await order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.mealId",
          totalQuantity: { $sum: "$orderItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
    ]);
  }

  async MealsTop(result: mongoose.Types.ObjectId[]) {
    return await Meal.populate(result, { path: "_id" });
  }
}


export default new Order();
