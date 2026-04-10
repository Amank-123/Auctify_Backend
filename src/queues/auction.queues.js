import { Queue } from "bullmq";
import { RedisClient } from "../config/redis.js";

export const auctionQueue = new Queue("auctionQueue", {
    connection: RedisClient,
    defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
