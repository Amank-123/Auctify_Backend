import { RedisClient } from "../config/redis.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: process.env.AUTH_RATE_LIMIT_MAX,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args) => RedisClient.call(...args),
    }),

    keyGenerator: (req) => {
        const email = req.body?.email || "unknown";
        const userIp = ipKeyGenerator(req);
        return `${userIp}-${email}`;
    },

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again after 10 minutes",
        });
    },
});
