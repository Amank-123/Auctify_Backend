import { Message } from "../models/message.model.js";

const onlineUsers = new Map();

export const messageSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("CONNECTED:", socket.id);

        socket.on("join_user", (userId) => {
            onlineUsers.set(userId, socket.id);

            io.emit("online_users", Array.from(onlineUsers.keys()));
        });

        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        });

        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
        });

        socket.on("message_seen", async ({ roomId, userId }) => {
            try {
                await Message.updateMany(
                    {
                        roomId,
                        senderId: { $ne: userId },
                        seenBy: { $ne: userId },
                    },
                    {
                        $push: {
                            seenBy: userId,
                        },
                    }
                );

                io.to(roomId).emit("message_seen", {
                    roomId,
                    userId,
                });
            } catch (error) {
                console.log("SEEN ERROR:", error);
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }

            io.emit("online_users", Array.from(onlineUsers.keys()));
        });
    });
};
