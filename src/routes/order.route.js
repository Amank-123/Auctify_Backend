import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    sellerOrders,
    buyerOrder,
} from "../controllers/order.controller.js";
const router = express.Router();

router.route("/create").post(protect, createOrder);
router.route("/buyerOrders").get(protect, buyerOrder);
router.route("/sellerOrders").get(protect, sellerOrders);

export default router;
