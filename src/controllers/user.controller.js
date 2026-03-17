import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserDB } from "../services/user.service.js";

const registerUser = asyncHandler(async (req, res) => {
    await registerUserDB(req.body);
    return ApiResponse(res, 200, "user created successfully");
});

export { registerUser };
