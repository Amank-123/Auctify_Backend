import { RedisClient } from "../config/redis.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

export const protectedApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.API_RATE_LIMIT_MAX,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args) => RedisClient.call(...args),
    }),

    keyGenerator: (req) => {
        const uid = req.user._id;
        const userIp = ipKeyGenerator(req);
        return `${userIp}-${uid}`;
    },

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again after 15 minutes",
        });
    },
});
