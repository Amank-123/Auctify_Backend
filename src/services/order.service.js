import { Order } from "../models/order.model.js";
import { Auction } from "../models/auction.model.js";
import { ApiError } from "../utils/ApiError.js";

const createOrderDB = async (orderData, userId) => {
    const existsOnAuctionId = await Order.findOne({
        auctionId: orderData.auctionId,
    });
    if (existsOnAuctionId) throw new ApiError(400, "Order already exists");

    const auction = await Auction.findById(orderData.auctionId);
    if (!auction) throw new ApiError(404, "Auction not found");
    return await Order.create({
        ...orderData,
        buyerId: userId,
        sellerId: auction.sellerId,
    });
};

const buyerOrdersDB = async (userId) => {
    return await Order.find({ buyerId: userId })
        .populate("buyerId")
        .populate("auctionId");
};
const sellerOrdersDB = async (userId) => {
    const order = await Order.find({ sellerId: userId })
        .populate("auctionId")
        .populate("buyerId");
    return order;
};

const paymentStatusUpdateDB = async (orderId, userId, paymentStatus) => {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.buyerId.toString() !== userId.toString())
        throw new ApiError(403, "Not Allowed");
    order.paymentStatus = paymentStatus;
    if (order.paymentStatus === "completed") {
        order.orderStatus = "confirmed";
    }
    await order.save();
    return order;
};

const orderStatusUpdateDB = async (orderId, userId, orderStatus) => {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.sellerId.toString() !== userId.toString())
        throw new ApiError(403, "Not Allowed");
    order.orderStatus = orderStatus;
    await order.save();
    return order;
};

const deleteOrderDB = async (orderId) => {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    return order;
};

const allOrdersDB = async () => {
    const orders = await Order.find();
    return orders;
};

const orderCancelDB = async (orderId, userId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.buyerId.toString() !== userId.toString())
        throw new ApiError(403, "Not allowed");

    if (order.orderStatus === "confirmed")
        throw new ApiError(400, "Confirmed Order cannot be cancelled");
    order.orderStatus = "cancelled";
    await order.save();
    return order;
};

const updateOrderDB = async (orderId, update) => {
    const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: update },
        {
            returnDocument: "after",
        }
    );
    if (!order) throw new ApiError(404, "Order not found");
    return order;
};

const singleOrderDB = async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, buyerId: userId })
        .populate("auctionId")
        .populate("buyerId")
        .populate("sellerId");
    if (!order) throw new ApiError(404, "Order not found");
    return order;
};
export {
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
};
