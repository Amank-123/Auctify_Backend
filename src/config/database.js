import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

async function connectDB() {
    try {
        const app = await mongoose.connect(`process.env.MONGO_URI/${DB_NAME}`);
        console.log("Successfully connected to mongodb: ", app.connection.host);
    } catch (error) {
        process.exit(1);
        throw error;
    }
}

export default connectDB;
