export const emitEvent = (io, room, type, payload) => {
    io.to(room).emit("event", {
        type,
        payload,
    });
};
