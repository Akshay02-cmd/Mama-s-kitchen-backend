import { StatusCodes } from "http-status-codes";
import Order from "../model/order.model.js";
import Meal from "../model/Meal.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createOrder = async (req, res) => {
  const {
    items,
    deliveryAddress,
    deliveryPhone,
    status,
    paymentMethod,
    paymentStatus,
    paymentId,
    notes,
    deliverytime,
  } = req.body;

  let totalAmount = 0;
  const orderItems = [];

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

  const order = await Order.create({
    userId: req.user.userId,
    orderItems,
    totalAmount,
    deliveryAddress,
    deliveryPhone,
    status,
    paymentMethod,
    paymentStatus,
    paymentId,
    notes,
    deliverytime,
  });
  if (!order) {
    throw new BadRequestError("Unable to create order");
  }
  res.status(StatusCodes.CREATED).json({ order });
};

export const getOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("items.mealId");
  if (!order) {
    throw new NotFoundError(`Order with ID ${id} not found`);
  }
  res.status(StatusCodes.OK).json({ order });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("items.mealId");
  if (!orders || orders.length === 0) {
    throw new NotFoundError("No orders found");
  }
  res.status(StatusCodes.OK).json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).populate("items.mealId");
  if (!order) {
    throw new NotFoundError(`Order with ID ${id} not found`);
  }
  res.status(StatusCodes.OK).json({ order });
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id).populate("items.mealId");
  if (!order) {
    throw new NotFoundError(`Order with ID ${id} not found`);
  }
  res.status(StatusCodes.OK).json({ message: "Order deleted successfully" });
};

export const getUserOrders = async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ userId }).populate("items.mealId");
  if (!orders || orders.length === 0) {
    throw new NotFoundError("No orders found for this user");
  }
  res.status(StatusCodes.OK).json({ orders });
};

export const clearUserOrders = async (req, res) => {
  const userId = req.user.userId;
  await Order.deleteMany({ userId });
  res.status(StatusCodes.OK).json({ message: "All user orders cleared" });
};

export const getOrdersByStatus = async (req, res) => {
  const { status } = req.params;
  const orders = await Order.find({
    status,
  }).populate("items.mealId");
  if (!orders || orders.length === 0) {
    throw new NotFoundError("No orders found for this status");
  }
  res.status(StatusCodes.OK).json({ orders });
};

export const getOrdersWithinDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  }).populate("items.mealId");
  if (!orders || orders.length === 0) {
    throw new NotFoundError("No orders found within this date range");
  }
  res.status(StatusCodes.OK).json({ orders });
};

export const getTotalSales = async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);
  const totalSales = result[0] ? result[0].totalSales : 0;
  res.status(StatusCodes.OK).json({ totalSales });
};
