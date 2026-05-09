import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { verifySignature } from "../utils/verifySignature.js";
import razorpay from "../config/razorpay.js";
import { sendEmail } from "../utils/otp.js";

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
    await Order.findByIdAndUpdate(payment.orderId, {
        paymentStatus: "completed",
        orderStatus: "confirmed",
    });

    // 4. store both ids (IMPORTANT)
    payment.gateway.orderId = razorpay_order_id;
    payment.gateway.paymentId = razorpay_payment_id;
    const razorPayment = await razorpay.payments.fetch(razorpay_payment_id);

    payment.paymentMethod = razorPayment.method;

    await payment.save();

    return payment;
};

const createPaymentDB = async (data, userId) => {
    try {
        const order = await Order.findById(data.orderId);
        if (!order) throw new ApiError(403, "Order not found");
        if (order.orderStatus === "cancelled")
            throw new ApiError(403, "Order is cancelled you can't pay");

        let paymentExists = await Payment.findOne({
            orderId: data.orderId,
        });

        if (paymentExists?.status === "completed") {
            throw new ApiError(403, "Payment already completed");
        }

        const razorOrder = await razorpay.orders.create({
            amount: order.finalPrice * 100,
            currency: "INR",
            receipt: order._id.toString(),
        });

        if (paymentExists) {
            paymentExists.gateway.transactionId = razorOrder.id;
            paymentExists.status = "pending";
            await paymentExists.save();
            return {
                rzrPay: paymentExists,
                razorOrder,
            };
        }

        const rzrPay = await Payment.create({
            userId,
            orderId: data.orderId,
            amount: order.finalPrice * 100,
            paymentMethod: data.paymentMethod,
            status: "pending",
            gateway: {
                name: "razorpay",
                transactionId: razorOrder.id,
            },
        });

        return {
            rzrPay,
            razorOrder,
        };
    } catch (err) {
        throw new ApiError(
            err?.statusCode || 400,
            err?.error?.description || err?.message || "Payment failed"
        );
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

    if (payment.status === "completed") {
        throw new ApiError(400, "Completed payment must be refunded");
    }
    payment.status = "cancelled";
    await payment.save();
    await Order.findByIdAndUpdate(payment.orderId, {
        paymentStatus: "cancelled",
        orderStatus: "cancelled",
    });
    return payment;
};

/**  Refund Payment */
const refundPaymentDB = async (paymentId) => {
    try {
        const payment = await Payment.findById(paymentId);

        if (!payment) throw new ApiError(404, "Payment not found");

        if (payment.status !== "completed")
            throw new ApiError(400, "Only completed payments can be refunded");

        if (!payment.gateway?.paymentId)
            throw new ApiError(400, "Razorpay payment id missing");
        console.log(payment.amount);
        // refund from razorpay
        const refund = await razorpay.payments.refund(
            payment.gateway.paymentId,
            {
                amount: payment.amount,
                speed: "normal",
            }
        );
        console.log(payment.amount);
        // update payment
        payment.status = "refunded";

        payment.gateway.refundId = refund.id;

        await payment.save();

        // update order
        await Order.findByIdAndUpdate(payment.orderId, {
            paymentStatus: "refunded",
            orderStatus: "cancelled",
        });

        return refund;
    } catch (err) {
        console.log(err);

        throw new ApiError(
            err?.statusCode || 400,

            err?.error?.description || err?.message || "Refund failed"
        );
    }
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
const requestOfflinePaymentDB = async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order) throw new ApiError(404, "Order not found");

    if (order.buyerId.toString() !== userId.toString()) {
        throw new ApiError(403, "Not allowed");
    }

    // already paid
    if (order.paymentStatus === "completed") {
        throw new ApiError(400, "Order already paid");
    }

    // already requested
    if (order.orderStatus === "awaiting_offline_payment") {
        throw new ApiError(400, "Offline payment already requested");
    }

    // update order
    order.paymentStatus = "pending";

    order.orderStatus = "awaiting_offline_payment";

    await order.save();

    // create payment record
    await Payment.create({
        userId,
        orderId: order._id,

        amount: order.finalPrice * 100,

        paymentMethod: "offline_payment",

        status: "pending",

        gateway: {
            name: "offline",
            transactionId: `offline_${Date.now()}`,
        },
    });

    return order;
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
    requestOfflinePaymentDB,
};
