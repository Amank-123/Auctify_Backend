import { Queue } from "bullmq";
import { redisconnection } from "../config/redis.js";

export const auctionQueue = new Queue("auctionQueue", {
    connection: redisconnection,
    defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
