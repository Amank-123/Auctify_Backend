import { Order } from "../models/order.model.js";

const createOrderService = async (orderData, userId) => {
    const existsOnAuctionId = await Order.findOne({
        auctionId: orderData.auctionId,
    });
    if (existsOnAuctionId) throw new ApiError(400, "Order already exists");

    return await Order.create({ ...orderData, buyerId: userId });
};

const getBuyerOrders = async (userId) => {
    return await Order.find({ buyerId: userId })
        .populate("buyerId")
        .populate("auctionId");
};
const getSellerOrders = async (userId) => {
    const order = await Order.find({ sellerId: userId })
        .populate("auctionId")
        .populate("buyerId");
    return order;
};

const getPaymentStatusUpdate = async (orderId, userId, paymentStatus) => {
    const order = await Order.find({ orderId });
    if (!order) throw new ApiError(401, "Order not found");
    if (order.buyerId.toString() !== userId)
        throw new ApiError(403, "Not Allowed");
    order.paymentStatus = paymentStatus;
    if (order.paymentStatus === "completed") {
        order.orderStatus = "confirmed";
    }
    order.save();
    return order;
};

const getOrderStatusUpdate = async (orderId, userId, orderStatus) => {
    const order = await Order.find({ orderId });
    if (!order) throw new ApiError(401, "Order not found");
    if (order.sellerId.toString() !== userId)
        throw new ApiError(403, "Not Allowed");
    order.orderStatus = orderStatus;
    order.save();
    return order;
};

export {
    createOrderService,
    getBuyerOrders,
    getSellerOrders,
    getOrderStatusUpdate,
    getPaymentStatusUpdate,
};
