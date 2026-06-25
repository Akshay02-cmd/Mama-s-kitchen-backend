import order from "../../model/order.model.js";
import Meal from "../../model/Meal.model.js";

class Order {
  async Ordercreate(userId, orderData) {
    const {
      items,
      deliveryAddress,
      deliveryPhone,
      status = "PLACED",
      paymentMethod,
      paymentStatus = "PENDING",
      paymentId,
      notes,
      deliverytime,
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
      deliveryTime: deliverytime,
    });
  }

  async OrderGetById(orderId) {
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

  async OrderUpdateById(orderId, updateData) {
    return await order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async OrderByUserId(userId) {
    return await order
      .find({ userId })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderCount(filters = {}) {
    return await order.countDocuments(filters);
  }

  async OrderUpdateStatusById(orderId, updateData) {
    return await order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async OrderDeleteById(orderId) {
    return await order.findByIdAndDelete(orderId);
  }

  async OrderDeleteByUserId(userId) {
    return await order.deleteMany({ userId });
  }

  async OrderDeleteAll() {
    return await order.deleteMany({});
  }

  async OrderByStatus(status) {
    return await order
      .find({ status })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderWithinDateRange(startDate, endDate) {
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

  async MealsTop(result) {
    return await Meal.populate(result, { path: "_id" });
  }
}


export default new Order();
