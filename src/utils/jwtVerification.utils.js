import jwt from "jsonwebtoken";

const verifyAccessToken = function (token) {
    try {
        return jwt.verify(token, this.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
};

const verifyRefreshToken = function (token) {
    try {
        return jwt.verify(token, this.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
};

export { verifyAccessToken, verifyRefreshToken };
