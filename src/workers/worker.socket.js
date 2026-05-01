import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";

const pubClient = new Redis(process.env.REDIS_URL);
const subClient = pubClient.duplicate();

export const workerIO = new Server({
    adapter: createAdapter(pubClient, subClient),
});
