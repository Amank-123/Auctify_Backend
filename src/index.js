// import "dotenv/config";

import { app } from "./app.js";
import connectDB from "./config/database.js";
const Port = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(Port, () => {
            console.log(`Server is running on http://localhost:${Port}`);
        });
    })
    .catch((error) => console.error("MongoDB connection failed: ", error));
