import order from "../../model/order.model.js";
import Meal from "../../model/Meal.model.js";

const Ordercreate = async (userId, orderData) => {
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
};

const OrderGetById = async (orderId) => {
  return await order
    .findById(orderId)
    .populate("userId", "name email")
    .populate("orderItems.mealId", "name price is_Available");
};

const OrderGetAll = async () => {
  return await order
    .find({})
    .populate("userId", "name email")
    .populate("orderItems.mealId", "name price is_Available")
    .sort({ createdAt: -1 });
};

const OrderUpdateById = async (orderId, updateData) => {
  return await order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });
};

const OrderByUserId = async (userId) => {
  return await order
    .find({ userId })
    .populate("userId", "name email")
    .populate("orderItems.mealId", "name price is_Available")
    .sort({ createdAt: -1 });
};

const OrderCount = async (filters = {}) => {
  return await order.countDocuments(filters);
};

const OrderUpdateStatusById = async (orderId, updateData) => {
  return await order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });
};

const OrderDeleteById = async (orderId) => {
  return await order.findByIdAndDelete(orderId);
};

const OrderDeleteByUserId = async (userId) => {
  return await order.deleteMany({ userId });
};

const OrderDeleteAll = async () => {
  return await order.deleteMany({});
};

const OrderByStatus = async (status) => {
  return await order
    .find({ status })
    .populate("userId", "name email")
    .populate("orderItems.mealId", "name price is_Available")
    .sort({ createdAt: -1 });
};

const OrderWithinDateRange = async (startDate, endDate) => {
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
};

const MealgetTotalSales = async () => {
  return await order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);
};

const MealgetMonthlySales = async () => {
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
};

const MealgetTopSelling = async (limit = 5) => {
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
};

const MealsTop = async (result) => {
  await Meal.populate(result, { path: "_id" });
};

const Order = {
  Ordercreate,
  OrderGetById,
  OrderGetAll,
  OrderUpdateById,
  OrderByUserId,
  OrderCount,
  OrderUpdateStatusById,
  OrderByStatus,
  OrderWithinDateRange,
  OrderDeleteById,
  OrderDeleteByUserId,
  OrderDeleteAll,
  OrderWithinDateRange,
  MealgetTotalSales,
  MealgetMonthlySales,
  MealgetTopSelling,
};

export default Order;
