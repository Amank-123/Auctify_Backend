const handleViolation = (user) => {
    user.violationCount += 1;

    if (user.violationCount === 1) {
        user.status = "warned";
    } else if (user.violationCount === 2) {
        user.status = "temp-restricted";
    } else if (user.violationCount >= 3) {
        user.status = "banned";
    }
    user.save();
    return user;
};

export default handleViolation;
