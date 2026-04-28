export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_auction", (auctionId) => {
            socket.join(auctionId);
        });

        socket.on("leave_auction", (auctionId) => {
            socket.leave(auctionId);
        });
        socket.on("disconnect", (auctionId) => {
            console.log("User disconnected:", socket.id);
        });
    });
};
