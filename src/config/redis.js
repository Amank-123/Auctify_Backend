import IORedis from "ioredis";

export const redisconnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

redisconnection.on("connect", () => {
    console.log("✅ Redis connected");
});

redisconnection.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
