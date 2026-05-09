import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "completed",
                "failed",
                "cancelled",
                "refunded",
            ],
            default: "pending",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: [
                "card",
                "upi",
                "netbanking",
                "wallet",
                "emi",
                "paylater",
                "bank_transfer",
                "cardless_emi",
                "cash",
                "international",
            ],
            required: true,
        },

        gateway: {
            name: {
                type: String,
                required: true,
            },

            // razorpay order id
            transactionId: {
                type: String,
                required: true,
            },

            // razorpay payment id
            paymentId: {
                type: String,
            },

            // refund transaction id
            refundId: {
                type: String,
            },
        },

        failureReason: {
            type: String,
        },

        currency: {
            type: String,
            default: "INR",
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
