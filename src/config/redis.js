import IORedis from "ioredis";

export const RedisClient = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

RedisClient.on("connect", () => {
    console.log("✅ Redis connected");
});

RedisClient.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
