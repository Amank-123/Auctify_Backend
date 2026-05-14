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

    console.log("Access token: ", accessToken);
    console.log("Refresh token: ", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
};

const forgotPasswordDB = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found check email");
    console.log(email);

    await sendOtpDB(email);

    return user;
};

const resetForgottenPasswordDB = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(404, "User not found check email");
    console.log(user);

    if (!user.resetPasswordVerified)
        throw new ApiError(400, "Not verified to change the password");

    user.password = password;
    user.resetPasswordVerified = false;

    await user.save({ validateBeforeSave: false });
    return user;
};

const findOrCreateOAuthUser = async (profile) => {
    try {
        // Extract email safely
        const email = profile.emails?.[0]?.value;

        if (!email) {
            throw new Error("Google account email not found");
        }

        // Check if user already exists with googleId
        let user = await User.findOne({
            googleId: profile.id,
        });

        if (user) {
            return user;
        }

        // Check if account already exists with same email
        user = await User.findOne({ email });

        if (user) {
            // Link Google account
            user.googleId = profile.id;

            // Update profile image if available
            if (profile._json?.picture) {
                user.profile = profile._json.picture;
            }

            // Mark verified
            user.isVerified = true;

            await user.save({ validateBeforeSave: false });

            return user;
        }

        // Create completely new OAuth user
        const newUser = await User.create({
            email,

            firstName: profile.name?.givenName || "User",

            lastName: profile.name?.familyName || "",

            profile: profile._json?.picture || "",

            status: "neutral",

            isVerified: profile._json?.email_verified || true,

            googleId: profile.id,
        });

        return newUser;
    } catch (error) {
        console.error("findOrCreateOAuthUser Error:", error);
        throw error;
    }
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
    forgotPasswordDB,
    resetForgottenPasswordDB,
};
