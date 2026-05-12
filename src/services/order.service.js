import { Order } from "../models/order.model.js";
import { Auction } from "../models/auction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail } from "../utils/otp.js";

const createOrderDB = async (orderData, userId) => {
    const existsOnAuctionId = await Order.findOne({
        auctionId: orderData.auctionId,
    });
    if (existsOnAuctionId) throw new ApiError(400, "Order already exists");

    const auction = await Auction.findById(orderData.auctionId);
    if (!auction) throw new ApiError(404, "Auction not found");
    const result = await Order.create({
        ...orderData,
        buyerId: userId,
        sellerId: auction.sellerId,
    });

    return result;
};

const buyerOrdersDB = async (userId) => {
    return await Order.find({ buyerId: userId })
        .populate("buyerId")
        .populate({
            path: "auctionId",
            populate: {
                path: "category",
                select: "name",
            },
        })
        .populate("sellerId");
};
const sellerOrdersDB = async (userId) => {
    const order = await Order.find({ sellerId: userId })
        .populate({
            path: "auctionId",
            populate: {
                path: "category",
                select: "name",
            },
        })
        .populate("buyerId")
        .populate("sellerId");
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

const orderStatusUpdateDB = async (orderId, userId, orderStatus, io) => {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.sellerId.toString() !== userId.toString())
        throw new ApiError(403, "Not Allowed");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    order.deliveryOTP = otp;
    order.deliveryOTPExpiry = Date.now() + 1000 * 60 * 15;
    order.orderStatus = orderStatus;
    await order.save();

    io.to(`user_${order.buyerId}`).emit("ORDER_COUNT_DECREMENT");

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

const orderCancelDB = async (orderId, userId, io) => {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.buyerId.toString() !== userId.toString())
        throw new ApiError(403, "Not allowed");

    if (order.orderStatus === "confirmed")
        throw new ApiError(400, "Confirmed Order cannot be cancelled");
    order.orderStatus = "cancelled";
    await order.save();

    io.to(`user_${order.buyerId}`).emit("ORDER_COUNT_DECREMENT");

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
const sendDeliveryOTPDB = async (orderId, sellerId) => {
    const order = await Order.findById(orderId)
        .populate("buyerId")
        .populate("auctionId");

    if (!order) throw new ApiError(404, "Order not found");

    if (order.sellerId.toString() !== sellerId.toString())
        throw new ApiError(403, "Not allowed");

    if (order.paymentStatus !== "completed")
        throw new ApiError(400, "Payment not completed");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryOTP = otp;

    order.deliveryOTPExpiry = Date.now() + 1000 * 60 * 10;

    await order.save();
    console.log("DELIVERY ON EMAIL:", order.buyerId.email);
    await sendEmail(order.buyerId.email, otp);

    console.log("DELIVERY OTP:", otp);

    return order;
};
const verifyDeliveryOTPDB = async (orderId, otp, sellerId, io) => {
    const order = await Order.findById(orderId);

    if (!order) throw new ApiError(404, "Order not found");

    if (order.sellerId.toString() !== sellerId.toString()) {
        throw new ApiError(403, "Not allowed");
    }

    if (order.deliveryOTP !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (new Date() > order.deliveryOTPExpiry) {
        throw new ApiError(400, "OTP expired");
    }

    order.orderStatus = "delivered";

    order.deliveryOTP = null;

    order.deliveryOTPExpiry = null;

    await order.save();

    io.to(`user_${order.buyerId}`).emit("ORDER_COUNT_DECREMENT");

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
    sendDeliveryOTPDB,
    verifyDeliveryOTPDB,
};
