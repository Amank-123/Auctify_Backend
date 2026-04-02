import { Worker } from "bullmq";
import { endAuctionDB } from "../services/auction.service.js";
import { redisconnection } from "../config/redis";

const worker = new Worker(
    "auctionQueue",
    async (job) => {
        const { auctionId } = job.data;
        console.log("Ending the Auction with worker");
        await endAuctionDB(auctionId);
    },
    {
        connection: redisconnection,
    }
);

worker.on("completed", (job) => {
    console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job.id}`, err);
});
