import { Order, Meal } from "../../repository/index.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

export const createOrder = async (userId, orderData) => {
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

  let totalAmount = 0;
  const orderItems = [];

  // Validate and process each order item
  for (const item of items) {
    const meal = await Meal.MealGetById(item.mealId);

    if (!meal) {
      throw new NotFoundError(`Meal with ID ${item.mealId} not found`);
    }

    if (!meal.is_Available) {
      throw new BadRequestError(`Meal with ID ${item.mealId} is not available`);
    }

    const extrasTotal = (item.selectedExtras || []).reduce(
      (sum, extra) => sum + (extra.price || 0),
      0,
    );

    totalAmount += (item.price + extrasTotal) * item.quantity;
    orderItems.push({
      mealId: item.mealId,
      price: item.price,
      quantity: item.quantity,
      selectedExtras: (item.selectedExtras || []).map((extra) => ({
        extraId: extra.extraId,
        name: extra.name,
        price: extra.price,
      })),
    });
  }

  // Create order
  const order = await Order.Ordercreate({
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
    deliveryTime: deliverytime, // Map deliverytime to deliveryTime
  });

  if (!order) {
    throw new BadRequestError("Unable to create order");
  }

  return order;
};

export const getOrderById = async (orderId) => {
  const order = await Order.OrderGetById(orderId);
  return order;
};

export const getAllOrders = async () => {
  const orders = await Order.OrderGetAll();
  return orders;
};

export const getUserOrders = async (userId) => {
  const orders = await Order.OrderByUserId(userId);
  return orders;
};

export const updateOrderStatus = async (orderId, updateData) => {
  const order = await Order.OrderUpdateStatusById(orderId, updateData);
  return order;
};

export const deleteOrder = async (orderId) => {
  const order = await Order.OrderDeleteById(orderId);
  return order;
};

export const clearUserOrders = async (userId) => {
  const result = await Order.OrderDeleteByUserId(userId);
  return result.deletedCount;
};

export const getOrdersByStatus = async (status) => {
  const orders = await Order.OrderByStatus(status);
  return orders;
};

export const getOrdersWithinDateRange = async (startDate, endDate) => {
  const orders = await Order.OrderWithinDateRange(startDate, endDate);
  return orders;
};

export const getTotalSales = async () => {
  const result = await Order.MealgetTotalSales();

  return result[0] ? result[0].totalSales : 0;
};

export const getMonthlySales = async () => {
  const result = await Order.MealgetMonthlySales();
  return result;
};

export const getTopSellingMeals = async (limit = 5) => {
  const result = await Order.MealgetTopSellingMeals(limit);

  // Populate meal details
  const Meal = (await import("../../model/Meal.model.js")).default;
  const topMeals = await Meal.populate(result, { path: "_id" });

  return topMeals;
};

const orderService = {
  createOrder,
  getOrderById,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  clearUserOrders,
  getOrdersByStatus,
  getOrdersWithinDateRange,
  getTotalSales,
  getMonthlySales,
  getTopSellingMeals,
};

export default orderService;
