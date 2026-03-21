import { User } from "../models/user.model.js";

const loginUserDB = async (email, password) => {
    const user = await User.findOne({ email }).select(
        "+password +refreshToken"
    );
    if (!user) throw new Error(404, "User not found check email");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error(401, "Incorrect Credentials");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
};

const findOrCreateOAuthUser = async (profile) => {
    const email = profile.emails?.[0]?.value;

    const user = await User.findOne({ googleId: profile.id });

    if (user) return user;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        existingUser.googleId = profile.id;
        await existingUser.save({ validateBeforeSave: false });
        return existingUser;
    }

    return await User.create({
        email,
        googleId: profile.id,
    });
};

const findOrCreateGithubUser = async (profile) => {
    const email = profile.emails?.[0]?.value;

    const user = await User.findOne({ githubId: profile.id });

    if (user) return user;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        existingUser.githubId = profile.id;
        await existingUser.save({ validateBeforeSave: false });
        return existingUser;
    }

    if(email){ return await User.create({
        email,
        githubId: profile.id,
    });}

    return await User.create({
        username: profile.username,
        githubId: profile.id,
    });
};

export { loginUserDB, findOrCreateOAuthUser, findOrCreateGithubUser };
