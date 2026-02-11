/**
 * @fileoverview Owner Service
 * @module services/owner.service
 * @description Business logic for owner dashboard and statistics
 */

import Mess from "../model/Mess.model.js";
import Order from "../model/order.model.js";
import Meal from "../model/Meal.model.js";
import { NotFoundError } from "../errors/index.js";

/**
 * Get owner dashboard statistics
 * @param {string} ownerId - Owner user ID
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getOwnerDashboardStats = async (ownerId) => {
  // Get all messes owned by this owner
  const messes = await Mess.find({ ownerId });
  const messIds = messes.map(mess => mess._id);

  // Get all meals from these messes
  const meals = await Meal.find({ messId: { $in: messIds } });
  const mealIds = meals.map(meal => meal._id);

  // Get all orders containing meals from these messes
  const orders = await Order.find({
    "orderItems.mealId": { $in: mealIds }
  });

  // Calculate statistics
  const totalMesses = messes.length;
  const totalMeals = meals.length;
  const totalOrders = orders.length;
  
  // Calculate total revenue
  let totalRevenue = 0;
  let monthlyRevenue = 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  orders.forEach(order => {
    const orderMonth = new Date(order.createdAt).getMonth();
    const orderYear = new Date(order.createdAt).getFullYear();
    
    totalRevenue += order.totalAmount;
    
    if (orderYear === currentYear && orderMonth === currentMonth) {
      monthlyRevenue += order.totalAmount;
    }
  });

  // Get recent orders
  const recentOrders = await Order.find({
    "orderItems.mealId": { $in: mealIds }
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email")
    .populate("orderItems.mealId", "name price");

  return {
    totalSales: totalRevenue,
    totalOrders,
    totalMesses,
    monthlyRevenue,
    totalMeals,
    recentOrders,
    activeMesses: messes.filter(m => m.is_Active).length,
  };
};

/**
 * Get all messes owned by an owner
 * @param {string} ownerId - Owner user ID
 * @returns {Promise<Array>} Array of mess objects with statistics
 */
export const getOwnerMesses = async (ownerId) => {
  const messes = await Mess.find({ ownerId })
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });

  // Enhance each mess with statistics
  const messesWithStats = await Promise.all(
    messes.map(async (mess) => {
      // Get meals count for this mess
      const mealsCount = await Meal.countDocuments({ messId: mess._id });
      
      // Get meals for this mess
      const meals = await Meal.find({ messId: mess._id });
      const mealIds = meals.map(meal => meal._id);
      
      // Get orders containing these meals
      const orders = await Order.find({
        "orderItems.mealId": { $in: mealIds }
      });
      
      // Calculate revenue
      let revenue = 0;
      let ordersCount = 0;
      
      orders.forEach(order => {
        revenue += order.totalAmount;
        ordersCount++;
      });

      return {
        ...mess.toObject(),
        totalMeals: mealsCount,
        totalOrders: ordersCount,
        revenue,
        status: mess.is_Active ? 'active' : 'inactive',
      };
    })
  );

  return messesWithStats;
};

/**
 * Get meals for a specific mess
 * @param {string} messId - Mess ID
 * @returns {Promise<Array>} Array of meals
 */
export const getMessMeals = async (messId) => {
  const meals = await Meal.find({ messId })
    .populate("messId", "name area")
    .sort({ createdAt: -1 });

  return meals;
};

/**
 * Get orders for a specific mess
 * @param {string} messId - Mess ID
 * @param {string} [status] - Optional status filter
 * @returns {Promise<Array>} Array of orders
 */
export const getMessOrders = async (messId, status = null) => {
  // First get all meals for this mess
  const meals = await Meal.find({ messId });
  const mealIds = meals.map(meal => meal._id);

  // Build query for orders
  const query = {
    "orderItems.mealId": { $in: mealIds }
  };

  if (status) {
    query.status = status.toUpperCase();
  }

  // Get orders
  const orders = await Order.find(query)
    .populate("userId", "name email phone")
    .populate("orderItems.mealId", "name price mealType")
    .sort({ createdAt: -1 });

  return orders;
};

/**
 * Get mess statistics
 * @param {string} messId - Mess ID
 * @returns {Promise<Object>} Mess statistics
 */
export const getMessStats = async (messId) => {
  // Get meals for this mess
  const meals = await Meal.find({ messId });
  const mealIds = meals.map(meal => meal._id);
  
  // Get orders
  const orders = await Order.find({
    "orderItems.mealId": { $in: mealIds }
  });

  // Calculate statistics
  let totalRevenue = 0;
  let totalOrders = orders.length;
  let monthlyRevenue = 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Status counts
  const statusCounts = {
    PLACED: 0,
    CONFIRMED: 0,
    PREPARING: 0,
    OUT_FOR_DELIVERY: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  orders.forEach(order => {
    const orderMonth = new Date(order.createdAt).getMonth();
    const orderYear = new Date(order.createdAt).getFullYear();
    
    totalRevenue += order.totalAmount;
    
    if (orderYear === currentYear && orderMonth === currentMonth) {
      monthlyRevenue += order.totalAmount;
    }

    if (statusCounts[order.status] !== undefined) {
      statusCounts[order.status]++;
    }
  });

  return {
    totalOrders,
    totalRevenue,
    monthlyRevenue,
    activeMeals: meals.filter(m => m.is_Available).length,
    totalMeals: meals.length,
    averageRating: 0, // TODO: Calculate from reviews
    statusCounts,
  };
};

const ownerService = {
  getOwnerDashboardStats,
  getOwnerMesses,
  getMessMeals,
  getMessOrders,
  getMessStats,
};

export default ownerService;
