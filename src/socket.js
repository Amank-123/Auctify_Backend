export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinRoom", (userId) => {
            socket.on("joinRoom", (userId) => {
                socket.join(`user_${userId}`);
                console.log(`User ${userId} joined notification room`);
            });
        });

        socket.on("disconnect", (reason) => {
            console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
        });
    });
};
