import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
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
            required: true,
        },
        refreshToken: {
            type: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            pin: String,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
