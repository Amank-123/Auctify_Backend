import IORedis from "ioredis";

export const redisconnection = await new IORedis();

redisConnection.on("connect", () => {
    console.log("✅ Redis connected");
});

redisConnection.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
