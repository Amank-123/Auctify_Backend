import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true,
        },
        firstName: {
            type: String,
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [20, "Name cannot exceed 20 characters"],
            trim: true,
        },
        lastName: {
            type: String,
            minlength: [3, "Last Name must be at least 3 characters"],
            maxlength: [20, "Last Name cannot exceed 20 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
        },
        password: {
            type: String,
            select: false,
            required: function () {
                return !(this.googleId || this.githubId);
            },
        },
        profile: {
            type: String,
        },
        violationCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        status: {
            type: String,
            enum: ["warned", "temp-restricted", "banned", "neuteral"],
            default: "neutral",
        },
        refreshToken: {
            type: String,
            select: false,
        },
        googleId: {
            type: String,
            select: false,
        },
        githubId: {
            type: String,
            select: false,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            pin: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const tranformUser = function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.__v;

    return ret;
};

userSchema.set("toJSON", { transform: tranformUser });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
