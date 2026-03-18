import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwtVerification.utils.js";

const protect = asyncHandler(async function (req, _, next) {
    const cookie =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    console.log("COOKIES:", req.cookies);
    console.log("HEADERS:", req.headers.authorization);
    console.log("DECODE:", jwt.decode(cookie));

    if (!cookie) throw new ApiError(401, "Unautherised Access");
    const decode = verifyAccessToken(cookie);
    const user = await User.findById(decode._id);
    if (!user) throw new ApiError(401, "invalid user");
    req.user = user;
    next();
});

export { protect };
