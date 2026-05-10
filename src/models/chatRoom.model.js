import mongoose, { Mongoose, Schema } from "mongoose";
import { boolean } from "zod";
const chatRoomSchema = new Schema(
    {
        auctionId: {
            type: Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
            unique: true,
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageId: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },

        lastMessageAt: {
            type: Date,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);
export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
