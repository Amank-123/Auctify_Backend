import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { getMessagesDB, sendMessageDB } from "../services/message.service.js";

export const getMessages = asyncHandler(async (req, res) => {
    const data = await getMessagesDB(req.user._id, req.body.roomId);

    return ApiResponse(res, 200, "messages fetched", data);
});

export const sendMessage = asyncHandler(async (req, res) => {
    const io = req.app.get("io");

    const data = await sendMessageDB(
        io,
        req.user._id,
        req.body.roomId,
        req.body.text
    );

    return ApiResponse(res, 200, "message sent", data);
});
