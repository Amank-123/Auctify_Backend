import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    updateUserDB,
    getUserDB,
    deleteUserDB,
    toggleWatchListDB,
    fetchWatchListDB,
    resetPasswordDB,
} from "../services/user.service.js";

const getUser = asyncHandler(async (req, res) => {
    const data = await getUserDB(req.user._id);

    return ApiResponse(res, 200, "User fetched", data);
});

const updateUser = asyncHandler(async (req, res) => {
    console.log("the file:", req.file);

    const data = await updateUserDB(req.user._id, req.body, req.file);
    if (!data) throw new ApiError(500, "Unable to update user data");

    return ApiResponse(res, 200, "User updated successfully", data);
});

const deleteUser = asyncHandler(async (req, res) => {
    const data = await deleteUserDB(req.user._id);

    return ApiResponse(res, 200, "Successfully removed user from DB ");
});
const toggleWatchList = asyncHandler(async (req, res) => {
    const data = await toggleWatchListDB(req.user._id, req.params.auctionId);
    return ApiResponse(
        res,
        200,
        data.exist ? "Aded to WatchList successfully" : "removed",
        data
    );
});
const fetchWatchList = asyncHandler(async (req, res) => {
    const data = await fetchWatchListDB(req.user._id);
    return ApiResponse(res, 200, "WatchList fetched successfully", data);
});

const resetPassword = asyncHandler(async (req, res) => {
    const data = await resetPasswordDB(
        req.user._id,
        req.body.oldPassword,
        req.body.newPassword
    );
    return ApiResponse(res, data.reset == "Success" ? 200 : 400, data);
});
export {
    getUser,
    updateUser,
    deleteUser,
    toggleWatchList,
    fetchWatchList,
    resetPassword,
};
