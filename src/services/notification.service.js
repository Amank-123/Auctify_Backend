import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
// import { io } from "../index.js";

const addNotificationDB = async (io, userId, payload) => {
    const notification = await Notification.create({
        userId: userId,
        ...payload,
    });

    io.to(`user_${userId}`).emit("newNotification", notification);

    return notification;
};

const getNotificationDB = async (userId) => {
    const notification = await Notification.find({
        userId: userId,
        isDeleted: false,
    })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("auction"); 
    return notification;
};

const broadCastNotificationDB = async (io, payload,image) => {
    const users = await User.find({ isVerified: true }).select("_id");
    const notifications = await Notification.insertMany(
        users.map((user) => ({ userId: user._id, ...payload, image }))
    );
    notifications.forEach((notification) => {
        const room = `user_${notification.userId}`;
        io.to(room).emit("newNotification", notification);
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
const deleteNotificationDB = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            userId: userId,
        },
        {
            $set: {
                isDeleted: true,
            },
        },
        {
            returnDocument: "after",
        }
    );
    return notification;
};

const markAllAsReadNotificationDB = async (userId) => {
    const result = await Notification.updateMany(
        {
            userId: userId,
            isRead: false,
        },
        {
            $set: { isRead: true },
        }
    );

    return result;
};
export {
    addNotificationDB,
    getNotificationDB,
    broadCastNotificationDB,
    markAsReadNotificationDB,
    markAllAsReadNotificationDB,
    deleteNotificationDB,
};
