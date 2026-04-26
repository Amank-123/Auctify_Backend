import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
const addNotificationDB = async (userId, payload) => {
    const notification = await Notification.create({
        userId: userId,
        ...payload,
    });

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
    console.log(result);
    return users.length;
};
export { addNotificationDB, getNotificationDB, broadCastNotificationDB };
