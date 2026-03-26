import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    sellerOrders,
    buyerOrders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrderById,
    allOrders,
    cancelOrder,
    updateOrder,
    singleOrder,
} from "../controllers/order.controller.js";
const router = express.Router();

// Create order + get all orders (admin)
router.route("/").post(protect, createOrder).get(protect, allOrders);

// Buyer orders
router.route("/my").get(protect, buyerOrders);

// Seller orders
router.route("/seller").get(protect, sellerOrders);

// Single order + update + delete
router
    .route("/:id")
    .get(protect, singleOrder)
    .patch(protect, updateOrder)
    .delete(protect, deleteOrderById);

// Update order status
router.route("/status/:orderId").patch(protect, updateOrderStatus);

// Update payment status
router.route("/payment/:orderId").patch(protect, updatePaymentStatus);

// Cancel order
router.route("/cancel/:orderId").patch(protect, cancelOrder);

export default router;
