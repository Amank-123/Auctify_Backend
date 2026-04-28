import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/cloudinaryUploader.js";
import { sendOtpDB } from "./otp.service.js";

const registerUserDB = async (data) => {
    // console.log("file is undefined : ", file);
    // let mediaURL;
    // if (file) {
    //     if (!file.mimetype.startsWith("image"))
    //         throw new ApiError(400, "Profile should be type image");
    //     const media = await uploadToCloudinary(file.buffer, file.mimetype);
    //     mediaURL = media.secure_url;
    // }
    const user = await User.create({
        ...data,
        isVerified: false,
    });
    await sendOtpDB(user.email);

    return user;
};

const loginUserDB = async (email, password) => {
    const user = await User.findOne({ email }).select(
        "+password +refreshToken"
    );
    if (!user) throw new ApiError(404, "User not found check email");

    if (!user.isVerified) throw new ApiError(403, "Verify your email first");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new ApiError(401, "Incorrect Credentials");

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log(profile);
        existingUser.googleId = profile.id;
        await existingUser.save({ validateBeforeSave: false });
        return existingUser;
    }

    return await User.create({
        email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profile: profile._json?.picture,
        status: "neuteral",
        isVerified: profile._json.email_verified,
        googleId: profile.id,
    });
};

const findOrCreateGithubUser = async (profile) => {
    const email = profile.emails?.[0]?.value;

    const user = await User.findOne({ githubId: profile.id });

    if (user) return user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        existingUser.githubId = profile.id;
        await existingUser.save({ validateBeforeSave: false });
        return existingUser;
    }

    return await User.create({
        email,
        status: "neuteral",
        isVerified: true,
        githubId: profile.id,
    });
};

export {
    loginUserDB,
    findOrCreateOAuthUser,
    findOrCreateGithubUser,
    registerUserDB,
};
