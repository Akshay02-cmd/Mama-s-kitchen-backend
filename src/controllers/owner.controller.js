/**
 * @fileoverview Owner Controller
 * @module controllers/owner
 * @description Handle owner dashboard and mess management operations
 */

import { StatusCodes } from "http-status-codes";
import ownerService from "../services/owner.service.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Get owner dashboard statistics
 * @route GET /api/owner/dashboard/stats
 * @access Private (OWNER only)
 */
export const getOwnerDashboardStats = catchAsync(async (req, res) => {
  const stats = await ownerService.getOwnerDashboardStats(req.user.userId);
  res.status(StatusCodes.OK).json({
    success: true,
    stats,
  });
});

/**
 * Get all messes owned by the logged-in owner
 * @route GET /api/owner/messes
 * @access Private (OWNER only)
 */
export const getOwnerMesses = catchAsync(async (req, res) => {
  const messes = await ownerService.getOwnerMesses(req.user.userId);
  res.status(StatusCodes.OK).json({
    success: true,
    messes,
  });
});

/**
 * Get meals for a specific mess
 * @route GET /api/mess/:messId/meals
 * @access Public
 */
export const getMessMeals = catchAsync(async (req, res) => {
  const { messId } = req.params;
  const meals = await ownerService.getMessMeals(messId);
  res.status(StatusCodes.OK).json({
    success: true,
    meals,
  });
});

/**
 * Get orders for a specific mess
 * @route GET /api/mess/:messId/orders
 * @access Private (OWNER only)
 */
export const getMessOrders = catchAsync(async (req, res) => {
  const { messId } = req.params;
  const { status } = req.query;
  const orders = await ownerService.getMessOrders(messId, status);
  res.status(StatusCodes.OK).json({
    success: true,
    orders,
  });
});

/**
 * Get statistics for a specific mess
 * @route GET /api/mess/:messId/stats
 * @access Private (OWNER only)
 */
export const getMessStats = catchAsync(async (req, res) => {
  const { messId } = req.params;
  const stats = await ownerService.getMessStats(messId);
  res.status(StatusCodes.OK).json({
    success: true,
    stats,
  });
});
