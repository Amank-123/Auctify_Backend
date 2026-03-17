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
            unique: true,
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
            enum: ["card", "upi", "netbanking"],
            required: true,
        },

        gateway: {
            name: {
                type: String,
                required: true,
            },
            transactionId: {
                type: String,
                required: true,
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
