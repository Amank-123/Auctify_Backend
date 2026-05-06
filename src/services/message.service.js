import { Message } from "../models/message.model.js";
import { ChatRoom } from "../models/chatRoom.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getMessagesDB = async (userId, roomId) => {
    const room = await ChatRoom.findOne({
        _id: roomId,
        $or: [{ sellerId: userId }, { buyerId: userId }],
    });

    if (!room) throw new ApiError(403, "No access");

    return await Message.find({
        roomId,
    })
        .populate("senderId", "username profile")
        .sort({
            createdAt: 1,
        });
};

export const sendMessageDB = async (io, userId, roomId, text) => {
    const room = await ChatRoom.findOne({
        _id: roomId,
        $or: [{ sellerId: userId }, { buyerId: userId }],
    });

    if (!room) throw new ApiError(403, "No access");

    const msg = await Message.create({
        roomId,
        senderId: userId,
        text,
    });

    await ChatRoom.findByIdAndUpdate(roomId, {
        lastMessage: text,
        lastMessageAt: new Date(),
    });

    const full = await Message.findById(msg._id).populate(
        "senderId",
        "username profile"
    );

    io.to(roomId).emit("receive_message", full);

    return full;
};
