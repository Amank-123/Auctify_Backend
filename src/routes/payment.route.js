import express from "express";
import {
    createPayment,
    allPayment,
    paymentByOrder,
    userPayments,
    cancelPayment,
    refundPayment,
    updatePaymentStatus,
    verifyPayment,
} from "../controllers/payment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";

const router = express.Router();

// "/" → create + get all
router
    .route("/")
    .post(protect, protectedApiLimiter, createPayment)
    .get(protect, protectedApiLimiter, allPayment);

// "/my" → user payments
router.route("/my").get(protect, protectedApiLimiter, userPayments);

// "/order/:orderId"
router
    .route("/order/:orderId")
    .get(protect, protectedApiLimiter, paymentByOrder);

// "/cancel/:payId"
router
    .route("/cancel/:payId")
    .patch(protect, protectedApiLimiter, cancelPayment);

// "/status/:payId"
router
    .route("/status/:payId")
    .patch(protect, protectedApiLimiter, updatePaymentStatus);

// "/refund/:payId"
router
    .route("/refund/:payId")
    .patch(protect, protectedApiLimiter, refundPayment);
router.post("/verify", protect, protectedApiLimiter, verifyPayment);

export default router;
