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
    sendDeliveryOTP,
    verifyDeliveryOTP,
} from "../controllers/order.controller.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";
const router = express.Router();

// Create order + get all orders (admin)
router
    .route("/")
    .post(protect, protectedApiLimiter, createOrder)
    .get(protect, protectedApiLimiter, allOrders);

// Buyer orders
router.route("/my").get(protect, protectedApiLimiter, buyerOrders);

// Seller orders
router.route("/seller").get(protect, protectedApiLimiter, sellerOrders);

// Single order + update + delete
router
    .route("/:id")
    .get(protect, protectedApiLimiter, singleOrder)
    .patch(protect, protectedApiLimiter, updateOrder)
    .delete(protect, protectedApiLimiter, deleteOrderById);

// Update order status
router
    .route("/status/:orderId")
    .patch(protect, protectedApiLimiter, updateOrderStatus);

// Update payment status
router
    .route("/payment/:orderId")
    .patch(protect, protectedApiLimiter, updatePaymentStatus);

// Cancel order
router
    .route("/cancel/:orderId")
    .patch(protect, protectedApiLimiter, cancelOrder);

router.patch("/send-otp/:orderId", protect, sendDeliveryOTP);

router.patch("/verify-otp/:orderId", protect, verifyDeliveryOTP);

export default router;
