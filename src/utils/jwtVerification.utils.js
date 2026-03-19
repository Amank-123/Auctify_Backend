import jwt from "jsonwebtoken";

const verifyAccessToken = function (token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
};

const verifyRefreshToken = function (token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
};

export { verifyAccessToken, verifyRefreshToken };
