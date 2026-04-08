import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { verifySignature } from "../utils/verifySignature.js";
import razorpay from "../config/razorpay.js";

const verifyPaymentDB = async (data) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const isValid = verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    );

    if (!isValid) throw new ApiError(400, "Invalid payment");

    const payment = await Payment.findOne({
        "gateway.transactionId": razorpay_order_id,
    });

    if (!payment) throw new ApiError(404, "Payment not found");

    // 3. update status
    payment.status = "completed";

    // 4. store both ids (IMPORTANT)
    payment.gateway.orderId = razorpay_order_id;
    payment.gateway.paymentId = razorpay_payment_id;

    await payment.save();

    return payment;
};

/** Create payment */
const createPaymentDB = async (data, userId) => {
    try {
        console.log("data obj", data);
        const paymentExists = await Payment.findOne({ orderId: data.orderId });
        if (paymentExists) throw new ApiError(403, "payment already exists");

        const order = await Order.findById(data.orderId);
        console.log("order onj:", order);
        if (!order) throw new ApiError(403, "Order not found");
        // ✅ Create Razorpay order
        const razorOrder = await razorpay.orders.create({
            amount: order.finalPrice * 100,
            currency: "INR",
            receipt: order._id.toString(),
        });

        // ✅ Create payment in DB
        const rzrPay = await Payment.create({
            userId,
            orderId: data.orderId,
            amount: order.finalPrice,
            paymentMethod: data.paymentMethod, // 🔥 REQUIRED
            status: "pending",
            gateway: {
                name: "razorpay",
                transactionId: razorOrder.id,
            },
        });

        return { rzrPay, razorOrder };
    } catch (err) {
        console.log(err);
        throw err;
    }
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
    verifyPaymentDB,
    createPaymentDB,
    allPaymentDB,
    paymentByOrderDB,
    userPaymentsDB,
    cancelPaymentDB,
    refundPaymentDB,
    updatePaymentStatusDB,
};
