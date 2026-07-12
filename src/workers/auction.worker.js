import http from "http";
import connectDB from "../config/database.js";
import { Worker } from "bullmq";
import { endAuctionDB, startAuctionDB } from "../services/auction.service.js";
import { RedisClient } from "../config/redis.js";
import { workerIO } from "./worker.socket.js";

const PORT = process.env.PORT || 5001;

const healthServer = http.createServer((req, res) => {
    if (req.url === "/health" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });

        res.end(
            JSON.stringify({
                status: "ok",
                service: "auction-worker",
                timestamp: new Date().toISOString(),
            })
        );

        return;
    }

    res.writeHead(200, {
        "Content-Type": "application/json",
    });

    res.end(
        JSON.stringify({
            service: "auction-worker",
            status: "running",
        })
    );
});

const startWorker = async () => {
    try {
        await connectDB();

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

        worker.on("ready", () => {
            console.log("Auction worker ready");
        });

        worker.on("completed", (job) => {
            console.log(`Job completed: ${job.name} (${job.id})`);
        });

        worker.on("failed", (job, err) => {
            console.error(`❌ Job failed: ${job?.name} (${job?.id})`, err);
        });

        worker.on("error", (error) => {
            console.error("Worker error:", error);
        });

        healthServer.listen(PORT, "0.0.0.0", () => {
            console.log(`Worker health server running on port ${WORKER_PORT}`);

            console.log("Auction worker service started");
        });
    } catch (error) {
        console.error("Failed to start auction worker:", error);

        process.exit(1);
    }
};

startWorker();
