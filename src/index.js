import { app } from "./app.js";
import connectDB from "./config/database.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket/notification.socket.js";
import { initSocket } from "./socket/action.socket.js";

const server = http.createServer(app);
const Port = process.env.PORT;

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

socketHandler(io);

initSocket(io);

app.set("io", io);

connectDB()
    .then(() => {
        server.listen(Port, () => {
            console.log(`Server is running on http://localhost:${Port}`);
        });
    })
    .catch((error) => console.error("MongoDB connection failed: ", error));
