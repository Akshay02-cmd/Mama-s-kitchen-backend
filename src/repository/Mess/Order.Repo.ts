import order from "../../model/order.model.js";
import Meal from "../../model/Meal.model.js";

class Order {
  find(filters: any = {}) {
    return order.find(filters);
  }

  findById(orderId: any) {
    return order.findById(orderId);
  }

  async create(data: any) {
    return order.create(data);
  }

  countDocuments(filters: any = {}) {
    return order.countDocuments(filters);
  }

  deleteMany(filters: any = {}) {
    return order.deleteMany(filters);
  }

  async Ordercreate(userId: any, orderData: any = undefined) {
    const payload = orderData ?? userId;
    const orderUserId = orderData ? userId : payload.userId;
    const {
      orderItems: orderItemsData,
      items,
      deliveryAddress,
      deliveryPhone,
      status = "PLACED",
      paymentMethod,
      paymentStatus = "PENDING",
      paymentId,
      notes,
      deliverytime,
      orderItems,
      totalAmount,
    } = payload;
    return await order.create({
      userId: orderUserId,
      orderItems: orderItemsData ?? orderItems ?? items,
      totalAmount: totalAmount ?? 0,
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

  async OrderGetById(orderId: any) {
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

  async OrderUpdateById(orderId: any, updateData: any) {
    return await order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async OrderByUserId(userId: any) {
    return await order
      .find({ userId })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderCount(filters: any = {}) {
    return await order.countDocuments(filters);
  }

  async OrderUpdateStatusById(orderId: any, updateData: any) {
    return await order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async OrderDeleteById(orderId: any) {
    return await order.findByIdAndDelete(orderId);
  }

  async OrderDeleteByUserId(userId: any) {
    return await order.deleteMany({ userId });
  }

  async OrderDeleteAll() {
    return await order.deleteMany({});
  }

  async OrderByStatus(status: any) {
    return await order
      .find({ status })
      .populate("userId", "name email")
      .populate("orderItems.mealId", "name price is_Available")
      .sort({ createdAt: -1 });
  }

  async OrderWithinDateRange(startDate: any, endDate: any) {
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

  async MealgetTopSellingMeals(limit = 5) {
    return this.MealgetTopSelling(limit);
  }

  async MealsTop(result: any) {
    return await Meal.populate(result, { path: "_id" });
  }
}


export default new Order();
