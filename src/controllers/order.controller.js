import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createOrderService,
    getBuyerOrders,
    getSellerOrders,
    getOrderStatusUpdate,
    getPaymentStatusUpdate,
} from "../services/order.service.js";

const createOrder = asyncHandler(async (req, res) => {
    const order = await createOrderService(req.body, req.user._id);
    ApiResponse(res, 200, "Order created successfully !!!", order);
});

const sellerOrders = asyncHandler(async (req, res) => {
    const orders = await getSellerOrders(req.user._id);
    console.log("orders", orders);
    ApiResponse(res, 200, "Orders fetched successfully", orders);
});
const buyerOrder = asyncHandler(async (req, res) => {
    const orders = await getBuyerOrders(req.user._id);
    console.log("orders", orders);
    ApiResponse(res, 200, "Orders fetched successfully", orders);
});
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await getOrderStatusUpdate(
        req.body.orderId,
        req.user._id,
        req.body.orderStatus
    );
    ApiResponse(res, 200, "Order status successfully updated");
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
    const order = await getPaymentStatusUpdate(
        req.body.orderId,
        req.user._id,
        req.body.paymentStatus
    );
    ApiResponse(res, 200, "Payment status successfully updated");
});
export {
    createOrder,
    sellerOrders,
    buyerOrder,
    updateOrderStatus,
    updatePaymentStatus,
};
