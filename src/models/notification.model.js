import mongoose, { Schema } from "mongoose";
import { required } from "zod/mini";

const notificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                "outbid",
                "won",
                "newBid",
                "endingSoon",
                "system",
                "sponsored",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        auction: {
            type: Schema.Types.ObjectId,
            ref: "Auction",
            default: null,
        },

        image: {
            type: String,
            default: "",
        },

        ctaLink: {
            type: String,
            default: "",
        },

        isRead: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model("Notification", notificationSchema);
