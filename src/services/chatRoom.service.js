import { ChatRoom } from "../models/chatRoom.model.js";

const getMyChatRoomsDb = async (userId) => {
    return await ChatRoom.find({
        $or: [{ sellerId: userId }, { buyerId: userId }],
    })
        .populate("sellerId")
        .populate("buyerId")
        .populate("auctionId")
        .populate({
            path: "lastMessageId",
            populate: {
                path: "senderId",
                select: "_id username profile",
            },
        })
        .sort({ lastMessageAt: -1 });
};

const getMyChatRoomDb = async (userId, roomId) => {
    return await ChatRoom.findOne({
        _id: roomId,
        $or: [{ sellerId: userId }, { buyerId: userId }],
    })
        .populate("sellerId")
        .populate("buyerId")
        .populate("auctionId")
        .populate({
            path: "lastMessageId",
            populate: {
                path: "senderId",
                select: "_id username profile",
            },
        });
};

export { getMyChatRoomsDb, getMyChatRoomDb };
