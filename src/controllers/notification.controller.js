import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getNotificationDB,
    addNotificationDB,
    broadCastNotificationDB,
} from "../services/notification.service.js";

const addNotification = asyncHandler(async (req, res) => {
    const data = await addNotificationDB(req.user._id, req.body);
    return ApiResponse(res, 200, "notification added successfully", data);
});

const getNotification = asyncHandler(async (req, res) => {
    const data = await getNotificationDB(req.user._id);
    return ApiResponse(res, 200, "notification fetched successfully", data);
});

const broadCastNotification = asyncHandler(async (req, res) => {
    const data = await broadCastNotificationDB(req.body);
    return ApiResponse(res, 200, "notification Broadcasted successfully", data);
});
export { addNotification, getNotification, broadCastNotification };
