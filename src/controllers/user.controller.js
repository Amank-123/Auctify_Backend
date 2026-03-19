import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserDB, updateUserDB } from "../services/user.service.js";

const registerUser = asyncHandler(async (req, res) => {
    await registerUserDB(req.body);
    return ApiResponse(res, 200, "user created successfully");
});

const updateUser = asyncHandler(async (req, res) => {
    const data = await updateUserDB(req.user._id, req.body);
    if (!updatedUser) throw new ApiError(500, "Unable to update user data");

    return ApiResponse(res, 200, "User updated successfully", data);
});

export { registerUser, updateUser };
