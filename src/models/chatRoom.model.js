import mongoose, { Schema } from "mongoose";

const chatRoomSchema = new Schema(
    {
        auctionId: {
            type: Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
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
            ref: "ChatMessage",
            default: null,
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
