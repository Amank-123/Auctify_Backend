const checkUserViolation = (req, res, next) => {
    const user = req.user;

    if (user.status === "banned") {
        return res.status(403).json({
            success: false,
            message: "You are banned 🚫",
        });
    }

    if (user.status === "temp-restricted") {
        return res.status(403).json({
            success: false,
            message: "You are temporarily restricted ⚠️",
        });
    }

    next();
};
