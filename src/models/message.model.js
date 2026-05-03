import mongoose, { Mongoose, Schema } from "mongoose";
import { required } from "zod/mini";
const chatMessageSchema = new Schema(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "ChatRoom",
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        seenBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        messageType: {
            type: String,
            enum: ["text", "system"],
            default: "text",
        },
    },
    { timestamps: true }
);
export const Message = mongoose.model("ChatMessage", chatMessageSchema);
