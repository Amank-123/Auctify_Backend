export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_notification", (userId) => {
            socket.on("join_notification", (userId) => {
                socket.join(`user_${userId}`);
                console.log(`User ${userId} joined notification room`);
            });
        });

        socket.on("disconnect_notification", (reason) => {
            console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
        });
    });
};
