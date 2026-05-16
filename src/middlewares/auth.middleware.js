import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwtVerification.utils.js";

const protect = asyncHandler(async function (req, _, next) {
    const accessToken = req.cookies?.accessToken;

    // User is not logged in at all
    if (!accessToken) {
        throw new ApiError(401, "NO_TOKEN");
    }

    let decoded;

    try {
        decoded = verifyAccessToken(accessToken);
    } catch (err) {
        // Token expired
        if (err.name === "TokenExpiredError") {
            throw new ApiError(401, "TOKEN_EXPIRED");
        }

        // Invalid token
        throw new ApiError(401, "INVALID_TOKEN");
    }

    const user = await User.findById(decoded._id);

    if (!user) {
        throw new ApiError(401, "INVALID_USER");
    }

    req.user = user;

    next();
});

export { protect };
