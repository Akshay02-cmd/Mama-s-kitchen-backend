import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middelware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {createOrderSchema,updateOrderStatusSchema} from "../validators/orders.validators.js";

import {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
  clearUserOrders,
  getOrdersByStatus,
  getOrdersWithinDateRange,
  getTotalSales,
} from "../controllers/order.controller.js";

const router = express.Router();
router
  .get("/", getAllOrders)
  .post("/", auth, authorizeRoles("CUSTOMER"), validate(createOrderSchema), createOrder)
  .put("/:id", auth, authorizeRoles("OWNER"), validate(updateOrderStatusSchema), updateOrderStatus)
  .delete("/:id", auth, authorizeRoles("OWNER"), deleteOrder);

router.get("/user/orders", auth, getUserOrders);
router.delete("/user/orders/clear", auth, clearUserOrders);
router.get(
  "/status/:status",
  auth,
  authorizeRoles("OWNER"),
  getOrdersByStatus,
);
router.get(
  "/date-range",
  auth,
  authorizeRoles("OWNER"),
  getOrdersWithinDateRange,
);
router.get(
  "/total-sales",
  auth,
  authorizeRoles("OWNER"),
  getTotalSales,
);
router.get("/:id", auth, getOrder);

export default router;
