import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    sellerOrders,
    buyerOrder,
    updateOrderStatus,
    updatePaymentStatus,
} from "../controllers/order.controller.js";
const router = express.Router();

router.route("/create").post(protect, createOrder);
router.route("/buyerOrders").get(protect, buyerOrder);
router.route("/sellerOrders").get(protect, sellerOrders);
router.route("/updateOrderStatus").get(protect, updateOrderStatus);
router.route("/updatePaymentStatus").get(protect, updatePaymentStatus);

export default router;
