import { StatusCodes } from "http-status-codes";
import { orderService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.user.userId, req.body);
  res.status(StatusCodes.CREATED).json({ order });
});

export const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);
  res.status(StatusCodes.OK).json({ order });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(StatusCodes.OK).json({ orders });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.updateOrderStatus(id, req.body);
  res.status(StatusCodes.OK).json({ order });
});

export const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  await orderService.deleteOrder(id);
  res.status(StatusCodes.OK).json({ message: "Order deleted successfully" });
});

export const getUserOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.userId);
  res.status(StatusCodes.OK).json({ orders });
});

export const clearUserOrders = catchAsync(async (req, res) => {
  await orderService.clearUserOrders(req.user.userId);
  res.status(StatusCodes.OK).json({ message: "All user orders cleared" });
});

export const getOrdersByStatus = catchAsync(async (req, res) => {
  const { status } = req.params;
  const orders = await orderService.getOrdersByStatus(status);
  res.status(StatusCodes.OK).json({ orders });
});

export const getOrdersWithinDateRange = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const orders = await orderService.getOrdersWithinDateRange(startDate, endDate);
  res.status(StatusCodes.OK).json({ orders });
});

export const getTotalSales = catchAsync(async (req, res) => {
  const totalSales = await orderService.getTotalSales();
  res.status(StatusCodes.OK).json({ totalSales });
});

export const getMonthlySales = catchAsync(async (req, res) => {
  const monthlySales = await orderService.getMonthlySales();
  res.status(StatusCodes.OK).json({ monthlySales });
});

export const getTopSellingMeals = catchAsync(async (req, res) => {
  const topMeals = await orderService.getTopSellingMeals();
  res.status(StatusCodes.OK).json({ topMeals });
});

