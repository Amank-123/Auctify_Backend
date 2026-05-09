import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createOrderDB,
    buyerOrdersDB,
    sellerOrdersDB,
    paymentStatusUpdateDB,
    orderStatusUpdateDB,
    deleteOrderDB,
    allOrdersDB,
    orderCancelDB,
    updateOrderDB,
    singleOrderDB,
    sendDeliveryOTPDB,
    verifyDeliveryOTPDB,
} from "../services/order.service.js";

const createOrder = asyncHandler(async (req, res) => {
    const order = await createOrderDB(req.body, req.user._id);
    ApiResponse(res, 200, "Order created successfully !!!", order);
});

const sellerOrders = asyncHandler(async (req, res) => {
    const orders = await sellerOrdersDB(req.user._id);
    console.log("orders", orders);
    ApiResponse(res, 200, "Orders fetched successfully", orders);
});
const buyerOrders = asyncHandler(async (req, res) => {
    const orders = await buyerOrdersDB(req.user._id);
    console.log("orders", orders);
    ApiResponse(res, 200, "Orders fetched successfully", orders);
});
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await orderStatusUpdateDB(
        req.params.orderId,
        req.user._id,
        req.body.orderStatus
    );
    ApiResponse(res, 200, "Order status successfully updated", order);
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
    const order = await paymentStatusUpdateDB(
        req.params.orderId,
        req.user._id,
        req.body.paymentStatus
    );
    ApiResponse(res, 200, "Payment status successfully updated", order);
});

const deleteOrderById = asyncHandler(async (req, res) => {
    const deletedOrder = await deleteOrderDB(req.params.orderId);
    ApiResponse(res, 200, "Order successfully deleted", deletedOrder);
});

const allOrders = asyncHandler(async (req, res) => {
    const orders = await allOrdersDB();
    ApiResponse(res, 200, "All orders are fetched successfully", orders);
});

const cancelOrder = asyncHandler(async (req, res) => {
    const order = await orderCancelDB(req.params.orderId, req.user._id);
    ApiResponse(res, 200, "Order cancelled successfully", order);
});
const updateOrder = asyncHandler(async (req, res) => {
    const order = await updateOrderDB(req.params.id, req.body);
    ApiResponse(res, 200, "Order updated successfully", order);
});

const singleOrder = asyncHandler(async (req, res) => {
    const order = await singleOrderDB(req.params.id, req.user._id);
    ApiResponse(res, 200, "Order fetched successfully", order);
});
const sendDeliveryOTP = asyncHandler(async (req, res) => {
    const order = await sendDeliveryOTPDB(req.params.orderId, req.user._id);

    ApiResponse(res, 200, "OTP sent", order);
});

const verifyDeliveryOTP = asyncHandler(async (req, res) => {
    const order = await verifyDeliveryOTPDB(
        req.params.orderId,
        req.body.otp,
        req.user._id
    );

    ApiResponse(res, 200, "Order delivered", order);
});
export {
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
};
