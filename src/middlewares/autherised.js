import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "admin")
        throw new ApiError(403, "UnAutherised access denied");
    next();
});
export default isAdmin;
