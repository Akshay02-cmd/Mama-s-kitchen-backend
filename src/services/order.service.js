/**
 * @fileoverview Order Service
 * @module services/order.service
 * @description Business logic for order management operations
 */

import Order from "../model/order.model.js";
import Meal from "../model/Meal.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

/**
 * Create a new order
 * @param {string} userId - User ID
 * @param {Object} orderData - Order data
 * @param {Array} orderData.items - Array of order items
 * @param {string} orderData.items[].mealId - Meal ID
 * @param {number} orderData.items[].quantity - Quantity
 * @param {number} orderData.items[].price - Price per item
 * @param {string} orderData.deliveryAddress - Delivery address
 * @param {string} orderData.deliveryPhone - Delivery phone
 * @param {string} [orderData.status] - Order status
 * @param {string} orderData.paymentMethod - Payment method
 * @param {string} [orderData.paymentStatus] - Payment status
 * @param {string} [orderData.paymentId] - Payment transaction ID
 * @param {string} [orderData.notes] - Additional notes
 * @param {Date|string} [orderData.deliverytime] - Delivery time
 * @returns {Promise<Object>} Created order object
 * @throws {BadRequestError} If order creation fails or meal not available
 * @throws {NotFoundError} If meal not found
 */
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
    const meal = await Meal.findById(item.mealId);
    
    if (!meal) {
      throw new NotFoundError(`Meal with ID ${item.mealId} not found`);
    }

    if (!meal.is_Available) {
      throw new BadRequestError(`Meal with ID ${item.mealId} is not available`);
    }

    totalAmount += item.price * item.quantity;
    orderItems.push({
      mealId: item.mealId,
      price: item.price,
      quantity: item.quantity,
    });
  }

  // Create order
  const order = await Order.create({
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

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order object with populated meal data
 * @throws {NotFoundError} If order not found
 */
export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("userId", "name email")
    .populate({
      path: "orderItems.mealId",
      select: "name price mealType is_Veg image messId",
      populate: {
        path: "messId",
        select: "name address"
      }
    });

  if (!order) {
    throw new NotFoundError(`Order with ID ${orderId} not found`);
  }

  return order;
};

/**
 * Get all orders
 * @returns {Promise<Array>} Array of all orders (empty array if no orders)
 */
export const getAllOrders = async () => {
  const orders = await Order.find({})
    .populate("userId", "name email")
    .populate({
      path: "orderItems.mealId",
      select: "name price mealType is_Veg image messId",
      populate: {
        path: "messId",
        select: "name address"
      }
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

/**
 * Get orders by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user's orders (empty array if no orders)
 */
export const getUserOrders = async (userId) => {
  const orders = await Order.find({ userId })
    .populate({
      path: "orderItems.mealId",
      select: "name price mealType is_Veg image messId",
      populate: {
        path: "messId",
        select: "name address"
      }
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {Object} updateData - Update data
 * @param {string} updateData.status - New order status
 * @returns {Promise<Object>} Updated order object
 * @throws {NotFoundError} If order not found
 */
export const updateOrderStatus = async (orderId, updateData) => {
  const order = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("userId", "name email")
    .populate({
      path: "orderItems.mealId",
      select: "name price mealType is_Veg image messId",
      populate: {
        path: "messId",
        select: "name address"
      }
    });

  if (!order) {
    throw new NotFoundError(`Order with ID ${orderId} not found`);
  }

  return order;
};

/**
 * Delete order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Deleted order object
 * @throws {NotFoundError} If order not found
 */
export const deleteOrder = async (orderId) => {
  const order = await Order.findByIdAndDelete(orderId)
    .populate("orderItems.mealId", "name price");

  if (!order) {
    throw new NotFoundError(`Order with ID ${orderId} not found`);
  }

  return order;
};

/**
 * Clear all orders for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of deleted orders
 */
export const clearUserOrders = async (userId) => {
  const result = await Order.deleteMany({ userId });
  return result.deletedCount;
};

/**
 * Get orders by status
 * @param {string} status - Order status
 * @returns {Promise<Array>} Array of orders with the specified status
 * @throws {NotFoundError} If no orders found
 */
export const getOrdersByStatus = async (status) => {
  const orders = await Order.find({ status })
    .populate("userId", "name email")
    .populate({
      path: "orderItems.mealId",
      select: "name price mealType is_Veg image messId",
      populate: {
        path: "messId",
        select: "name address"
      }
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

/**
 * Get orders within date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Promise<Array>} Array of orders within date range
 * @throws {NotFoundError} If no orders found
 */
export const getOrdersWithinDateRange = async (startDate, endDate) => {
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .populate("userId", "name email")
    .populate({
      path: "orderItems.mealId",
      select: "name price mealType is_Veg image messId",
      populate: {
        path: "messId",
        select: "name address"
      }
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

/**
 * Get total sales amount
 * @returns {Promise<number>} Total sales amount
 */
export const getTotalSales = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  return result[0] ? result[0].totalSales : 0;
};

/**
 * Get monthly sales
 * @returns {Promise<Array>} Array of monthly sales data
 */
export const getMonthlySales = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        monthlySales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return result;
};

/**
 * Get top selling meals
 * @param {number} limit - Number of top meals to return (default: 5)
 * @returns {Promise<Array>} Array of top selling meals
 */
export const getTopSellingMeals = async (limit = 5) => {
  const result = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.mealId",
        totalQuantity: { $sum: "$orderItems.quantity" },
        totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
  ]);

  // Populate meal details
  const Meal = (await import("../model/Meal.model.js")).default;
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
