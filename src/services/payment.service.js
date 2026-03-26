import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";

/** Create payment */
const createPaymentDB = async (data, userId) => {
    const paymentExists = await Payment.findOne({ orderId: data.orderId });
    if (paymentExists) throw new ApiError(403, "payment already exists");
    const order = await Order.findById(data.orderId);
    if (!order) throw new ApiError(403, "Order not found");
    data.userId = userId;

    return await Payment.create(data);
};

/** For Admin */
const allPaymentDB = async () => {
    return await Payment.find().populate("orderId").populate("userId");
};

/**  Get Payment by Order */
const paymentByOrderDB = async (orderId, userId) => {
    const payment = await Payment.findOne({ orderId, userId });
    if (!payment) throw new ApiError(404, "Payment on these order not found");
    return payment;
};

/**  Get User Payments */
const userPaymentsDB = async (userId) => {
    return Payment.find({ userId }).populate("orderId");
};

/**  Cancel Payment */
const cancelPaymentDB = async (paymentId, userId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.userId.toString() !== userId.toString())
        throw new ApiError(403, "Not Allowed");
    payment.status = "cancelled";
    await payment.save();
    return payment;
};

/**  Refund Payment */
const refundPaymentDB = async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.status.toString() !== "completed")
        throw new ApiError(400, "Only completed payments can be refunded");
    payment.status = "refunded";
    payment.save();
    return payment;
};

/**  Update Payment Status */
const updatePaymentStatusDB = async (paymentId, status, failureReason) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiError(404, "Payment not found");
    payment.status = status;
    if (payment.status === "failed") {
        payment.failureReason = failureReason;
    }
    await payment.save();
    if (payment.status === "completed") {
        await Order.findByIdAndUpdate(payment.orderId, {
            paymentStatus: "completed",
            orderStatus: "confirmed",
        });
    }
    return payment;
};

export {
    createPaymentDB,
    allPaymentDB,
    paymentByOrderDB,
    userPaymentsDB,
    cancelPaymentDB,
    refundPaymentDB,
    updatePaymentStatusDB,
};
