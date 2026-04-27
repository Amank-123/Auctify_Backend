import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { io } from "../index.js";

const addNotificationDB = async (userId, payload) => {
    const notification = await Notification.create({
        userId: userId,
        ...payload,
    });

    io.to(`user_${userId}`).emit("newNotification", notification);

    return notification;
};

const getNotificationDB = async (userId) => {
    const notification = await Notification.find({ userId: userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("auction");
    return notification;
};

const broadCastNotificationDB = async (payload) => {
    const users = await User.find({ isVerified: true }).select("_id");
    const result = await Notification.insertMany(
        users.map((user) => ({ userId: user._id, ...payload }))
    );
    result.forEach((notification) => {
        io.to(`user_${notification.userId}`).emit(
            "newNotification",
            notification
        );
    });

    return users.length;
};

const markAsReadNotificationDB = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            userId: userId,
        },
        {
            $set: {
                isRead: true,
            },
        },
        {
            returnDocument: "after",
        }
    );
    return notification;
};
export {
    addNotificationDB,
    getNotificationDB,
    broadCastNotificationDB,
    markAsReadNotificationDB,
};
