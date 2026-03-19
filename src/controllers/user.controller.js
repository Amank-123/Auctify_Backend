import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    registerUserDB,
    updateUserDB,
    getUserDB,
    deleteUserDB,
} from "../services/user.service.js";

const registerUser = asyncHandler(async (req, res) => {
    await registerUserDB(req.body);
    return ApiResponse(res, 200, "user created successfully");
});

const getUser = asyncHandler(async (req, res) => {
    const data = await getUserDB(req.user._id);

    return ApiResponse(res, 200, "User fetched", data);
});

const updateUser = asyncHandler(async (req, res) => {
    const data = await updateUserDB(req.user._id, req.body);
    if (!data) throw new ApiError(500, "Unable to update user data");

    return ApiResponse(res, 200, "User updated successfully", data);
});

const deleteUser = asyncHandler(async (req, res) => {
    const data = await deleteUserDB(req.user._id);

    return ApiResponse(res, 200, "Successfully removed user from DB ");
});

export { registerUser, getUser, updateUser, deleteUser };
