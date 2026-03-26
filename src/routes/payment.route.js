import express from "express";
import {
    createPayment,
    allPayment,
    paymentByOrder,
    userPayments,
    cancelPayment,
    refundPayment,
    updatePaymentStatus,
} from "../controllers/payment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// "/" → create + get all
router.route("/").post(protect, createPayment).get(protect, allPayment);

// "/my" → user payments
router.route("/my").get(protect, userPayments);

// "/order/:orderId"
router.route("/order/:orderId").get(protect, paymentByOrder);

// "/cancel/:payId"
router.route("/cancel/:payId").patch(protect, cancelPayment);

// "/status/:payId"
router.route("/status/:payId").patch(protect, updatePaymentStatus);

// "/refund/:payId"
router.route("/refund/:payId").patch(protect, refundPayment);

export default router;
