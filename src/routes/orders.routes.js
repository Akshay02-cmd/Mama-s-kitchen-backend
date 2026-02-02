import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middelware.js";
import authorizeRoles from "../middleware/authorizeRoles.middelware.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/orders.validators.js";

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
  .route("/userorders")
  .get(auth, getUserOrders)
  .delete(auth, clearUserOrders);

router
  .route("/status/:status")
  .get(auth, authorizeRoles("OWNER"), getOrdersByStatus);

router
  .route("/date-range")
  .get(auth, authorizeRoles("OWNER"), getOrdersWithinDateRange);

router.route("/total-sales").get(auth, authorizeRoles("OWNER"), getTotalSales);

router
  .route("/")
  .get(auth, getAllOrders)
  .post(
    auth,
    authorizeRoles("CUSTOMER"),
    validate(createOrderSchema),
    createOrder,
  );

router
  .route("/:id")
  .get(auth, getOrder)
  .put(
    auth,
    authorizeRoles("OWNER"),
    validate(updateOrderStatusSchema),
    updateOrderStatus,
  )
  .delete(auth, authorizeRoles("OWNER"), deleteOrder);

export default router;
