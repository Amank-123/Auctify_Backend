import {
    getMyChatRoomsDb,
    getMyChatRoomDb,
} from "../services/chatRoom.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMyChatRooms = asyncHandler(async (req, res) => {
    try {
        const data = await getMyChatRoomsDb(req.user._id);

        return ApiResponse(res, 200, "chat room fetched successfully", data);
    } catch (error) {
        console.log("GET ROOM ERROR:", error);

        throw error;
    }
});

const getMyChatRoom = asyncHandler(async (req, res) => {
    const data = await getMyChatRoomDb(req.user._id, req.body.roomId);
    return ApiResponse(res, 200, "chat romm fetched successfully", data);
});

export { getMyChatRooms, getMyChatRoom };
