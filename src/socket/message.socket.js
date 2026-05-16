// ================= MESSAGE SOCKET =================

import { Message } from "../models/message.model.js";
import { ChatRoom } from "../models/chatRoom.model.js";

const onlineUsers = new Map();

export const messageSocket = (io) => {
    io.on("connection", (socket) => {
        // console.log("✅ SOCKET CONNECTED:", socket.id);

        /* ================= REGISTER USER ================= */

        socket.on("join_user", (userId) => {
            if (!userId) return;

            socket.userId = userId;

            onlineUsers.set(String(userId), socket.id);

            io.emit("online_users", Array.from(onlineUsers.keys()));

            // console.log("🟢 USER ONLINE:", userId);
        });

        /* ================= JOIN ROOM ================= */

        socket.on("join_room", (roomId) => {
            if (!roomId) return;

            socket.join(roomId);

            // console.log(`🚪 Joined Room: ${roomId}`);
        });

        /* ================= LEAVE ROOM ================= */

        socket.on("leave_room", (roomId) => {
            if (!roomId) return;

            socket.leave(roomId);

            console.log(`❌ Left Room: ${roomId}`);
        });

        /* ================= SEND MESSAGE ================= */

        socket.on("send_message", async ({ roomId, senderId, text }) => {
            try {
                /* ================= VALIDATION ================= */

                if (!roomId || !senderId || !text?.trim()) {
                    return;
                }

                /* ================= CREATE MESSAGE ================= */

                const msg = await Message.create({
                    roomId,
                    senderId,
                    text,
                    seenBy: [senderId],
                });

                /* ================= POPULATE MESSAGE ================= */

                const populatedMessage = await Message.findById(
                    msg._id
                ).populate("senderId", "username profile");

                /* ================= UPDATE ROOM ================= */

                const room = await ChatRoom.findByIdAndUpdate(
                    roomId,
                    {
                        lastMessage: text,
                        lastMessageAt: new Date(),
                        lastMessageId: msg._id,
                    },
                    {
                        new: true,
                    }
                );

                if (!room) {
                    console.log("❌ ROOM NOT FOUND");

                    return;
                }

                /* ================= ROOM CHAT REALTIME ================= */

                io.to(roomId).emit("receive_message", populatedMessage);

                /* ================= FIND RECEIVER ================= */

                let receiverId = null;

                if (String(room.sellerId) === String(senderId)) {
                    receiverId = room.buyerId;
                } else {
                    receiverId = room.sellerId;
                }

                /* ================= FIND RECEIVER SOCKET ================= */

                const receiverSocketId = onlineUsers.get(String(receiverId));

                // console.log("📨 RECEIVER SOCKET:", receiverSocketId);

                /* ================= CHAT NOTIFICATION ================= */

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("room_updated", {
                        roomId,

                        senderId,

                        receiverId,

                        message: populatedMessage.text,

                        createdAt: populatedMessage.createdAt,

                        messageData: populatedMessage,
                    });

                    console.log("✅ room_updated emitted");
                }

                // console.log("📩 MESSAGE SENT");
            } catch (error) {
                console.log("❌ SEND ERROR:", error);
            }
        });

        /* ================= MESSAGE SEEN ================= */

        socket.on("message_seen", async ({ roomId, userId }) => {
            try {
                if (!roomId || !userId) {
                    return;
                }

                const unseenMessages = await Message.find({
                    roomId,

                    senderId: {
                        $ne: userId,
                    },

                    seenBy: {
                        $ne: userId,
                    },
                });

                const messageIds = unseenMessages.map((msg) => msg._id);

                await Message.updateMany(
                    {
                        _id: {
                            $in: messageIds,
                        },
                    },
                    {
                        $addToSet: {
                            seenBy: userId,
                        },
                    }
                );

                io.to(roomId).emit("message_seen", {
                    roomId,

                    messageIds,

                    seenBy: userId,
                });

                // console.log("👀 MESSAGE SEEN:", messageIds.length);
            } catch (error) {
                console.log("❌ SEEN ERROR:", error);
            }
        });

        /* ================= TYPING ================= */

        socket.on("typing", ({ roomId, userId }) => {
            socket.to(roomId).emit("typing", {
                roomId,
                userId,
            });
        });

        /* ================= STOP TYPING ================= */

        socket.on("stop_typing", ({ roomId, userId }) => {
            socket.to(roomId).emit("stop_typing", {
                roomId,
                userId,
            });
        });

        /* ================= DISCONNECT ================= */

        socket.on("disconnect", () => {
            if (socket.userId) {
                onlineUsers.delete(String(socket.userId));
            }

            io.emit("online_users", Array.from(onlineUsers.keys()));

            // console.log("🔌 DISCONNECTED:", socket.id);
        });
    });
};
