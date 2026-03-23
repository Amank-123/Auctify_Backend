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

export { createOrderService, getBuyerOrders, getSellerOrders };
