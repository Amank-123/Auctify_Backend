import mongoose, { Schema, SchemaType } from "mongoose";

const orderSchema = new Schema(
    {
        auctionId: {
            type: Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
            unique: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        paymentStatus: {
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
        orderStatus: {
            type: String,
            enum: [
                "awaiting_payment",
                "awaiting_offline_payment",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "awaiting_payment",
            required: true,
        },
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
            pin: String,
        },
        deliveryOTP: {
            type: String,
        },

        deliveryOTPExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ orderStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);
