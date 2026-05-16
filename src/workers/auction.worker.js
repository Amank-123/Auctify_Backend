import connectDB from "../config/database.js";
await connectDB();

import { Worker } from "bullmq";
import { endAuctionDB, startAuctionDB } from "../services/auction.service.js";
import { RedisClient } from "../config/redis.js";
import { workerIO } from "./worker.socket.js";

const worker = new Worker(
    "auctionQueue",
    async (job) => {
        const { auctionId } = job.data;

        switch (job.name) {
            case "startAuction":
                console.log("Starting auction:", auctionId);
                await startAuctionDB(auctionId, workerIO);
                break;

            case "endAuction":
                console.log("Ending auction:", auctionId);
                await endAuctionDB(auctionId, workerIO);
                break;

            default:
                console.warn("Unknown job type:", job.name);
        }
    },
    {
        connection: RedisClient,
    }
);

worker.on("completed", (job) => {
    console.log(` Job completed: ${job.name} (${job.id})`);
});

worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job.name} (${job.id})`, err);
});
