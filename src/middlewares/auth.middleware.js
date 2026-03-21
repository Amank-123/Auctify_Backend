import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwtVerification.utils.js";

const protect = asyncHandler(async function (req, _, next) {
    const cookie = req.cookies?.accessToken;
    console.log(cookie)
    if (!cookie) throw new ApiError(401, "Unautherised Access");
    const decode = verifyAccessToken(cookie);
    const user = await User.findById(decode._id);
    if (!user) throw new ApiError(401, "invalid user");
    req.user = user;
    next();
});

export { protect };
