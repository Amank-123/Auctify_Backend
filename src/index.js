// import dotenv from "dotenv";
// dotenv.config();
import { app } from "./app.js";
import connectDB from "./config/database.js";
const Port = process.env.PORT;
console.log("redis", process.env.REDIS_HOST);
connectDB()
    .then(() => {
        app.listen(Port, () => {
            console.log(`Server is running on http://localhost:${Port}`);
        });
    })
    .catch((error) => console.error("MongoDB connection failed: ", error));
