import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const app = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`
        );
        console.log("Successfully connected to mongodb: ", app.connection.host);
        if (!app) process.exit(1);
    } catch (error) {
        throw error;
    }
};

export default connectDB;
