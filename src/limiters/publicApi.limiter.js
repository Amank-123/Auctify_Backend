import { RedisClient } from "../config/redis.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

export const publicApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.PUBLIC_API_RATE_LIMIT_MAX,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args) => RedisClient.call(...args),
    }),

    keyGenerator: (req) => {
        return ipKeyGenerator(req);
    },

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again after 15 minutes",
        });
    },
});
