import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    updateUserDB,
    getUserDB,
    deleteUserDB,
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

export { getUser, updateUser, deleteUser };
