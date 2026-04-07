import {
    createPaymentDB,
    allPaymentDB,
    paymentByOrderDB,
    userPaymentsDB,
    cancelPaymentDB,
    refundPaymentDB,
    updatePaymentStatusDB,
    verifyPaymentDB,
} from "../services/payment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPayment = asyncHandler(async (req, res) => {
    const payment = await createPaymentDB(req.body, req.user._id);
    ApiResponse(res, 200, "payment created successfully", payment);
});

const allPayment = asyncHandler(async (req, res) => {
    const payments = await allPaymentDB();
    ApiResponse(res, 200, "payments fetched successfully", payments);
});

const paymentByOrder = asyncHandler(async (req, res) => {
    const payment = await paymentByOrderDB(req.params.orderId, req.user._id);
    ApiResponse(res, 200, "payment fetched successfully", payment);
});

const userPayments = asyncHandler(async (req, res) => {
    const payments = await userPaymentsDB(req.user._id);
    ApiResponse(res, 200, "payments fetched successfully", payments);
});

const cancelPayment = asyncHandler(async (req, res) => {
    const payment = await cancelPaymentDB(req.params.payId, req.user._id);
    ApiResponse(res, 200, "payment cancelled successfully", payment);
});

const refundPayment = asyncHandler(async (req, res) => {
    const payment = await refundPaymentDB(req.params.payId);
    ApiResponse(res, 200, "payment refunded successfully", payment);
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
    const payment = await updatePaymentStatusDB(
        req.params.payId,
        req.body.status,
        req.body.failureReason
    );
    ApiResponse(res, 200, "payment status updated successfully", payment);
});

const verifyPayment = asyncHandler(async (req, res) => {
    const payment = await verifyPaymentDB(req.body);
    ApiResponse(res, 200, "Payment verified", payment);
});

export {
    createPayment,
    allPayment,
    paymentByOrder,
    userPayments,
    cancelPayment,
    refundPayment,
    updatePaymentStatus,
    verifyPayment,
};
