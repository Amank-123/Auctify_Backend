import { ChatRoom } from "../models/chatRoom.model.js";

const getMyChatRoomsDb = async (userId) => {
    return await ChatRoom.find({
        $or: [{ sellerId: userId }, { buyerId: userId }],
    })
        .populate("sellerId")
        .populate("buyerId")
        .populate("auctionId")
        .sort({ lastMessageAt: -1 });
};
const getMyChatRoomDb = async (userId, roomId) => {
    return await ChatRoom.find({
        _id: roomId,
        $or: [{ sellerId: userId }, { buyerId: userId }],
    })
        .populate("sellerId")
        .populate("buyerId")
        .populate("auctionId")
        .sort({ lastMessageAt: -1 });
};

export { getMyChatRoomsDb, getMyChatRoomDb };
