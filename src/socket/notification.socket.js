export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinRoom", (userId) => {
            const room = `user_${userId}`;
            socket.join(room);
        });

        socket.on("join_notification", (userId) => {
            const room = `user_${userId}`;
            socket.join(room);
        });

        socket.on("disconnect", (reason) => {
            console.log(`disconnected: ${socket.id}, Reason: ${reason}`);
        });
    });
};
