import jwt from "jsonwebtoken";

const verifyAccessToken = function (token) {
    try {
        return jwt.verify(token, process.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
};

const verifyRefreshToken = function (token) {
    try {
        console.log("DECODE:", jwt.decode(token));
        return jwt.verify(token, process.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
};

export { verifyAccessToken, verifyRefreshToken };
