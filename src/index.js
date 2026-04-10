import { app } from "./app.js";
import connectDB from "./config/database.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const Port = process.env.PORT;

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
console.log("redis", process.env.REDIS_HOST);
connectDB()
    .then(() => {
        server.listen(Port, () => {
            console.log(`Server is running on http://localhost:${Port}`);
        });
    })
    .catch((error) => console.error("MongoDB connection failed: ", error));
