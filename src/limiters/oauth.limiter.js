import { RedisClient } from "../config/redis.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

export const oauthLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: process.env.OAUTH_RATE_LIMIT_MAX,

    store: new RedisStore({
        sendCommand: (...args) => RedisClient.call(...args),
    }),

    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const userIp = ipKeyGenerator(req);
        return `${userIp}-${req.path}`;
    },

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again in 10 minutes",
        });
    },
});
