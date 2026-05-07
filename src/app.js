import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import passport from "passport";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import auctionRouter from "./routes/auction.route.js";
import bidRouter from "./routes/bid.route.js";
import paymentRouter from "./routes/payment.route.js";
import OTPRouter from "./routes/otp.route.js";
import ChatBotRouter from "./routes/chatbot.route.js";
import ChatRoomRouter from "./routes/chatRoom.route.js";
import NotificationRouter from "./routes/notification.route.js";
import CategoryRouter from "./routes/categories.route.js";
import messageRouter from "./routes/message.route.js";
import bannerRouter from "./routes/banner.route.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json());

// // app.use(xss());
// app.use(
//   mongoSanitize({
//     allowDots: true,
//     replaceWith: "_",
//   })
// );

app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

//Routes middlewares
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/auction", auctionRouter);
app.use("/api/bid", bidRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/otp", OTPRouter);
app.use("/api/chat", ChatBotRouter);
app.use("/api/notify", NotificationRouter);
app.use("/api/Room", ChatRoomRouter);
app.use("/api/message", messageRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/banner", bannerRouter);

//Server Time Route
app.get("/api/time", (req, res) => {
    res.json({
        serverTime: Date.now(),
    });
});

//All routes should be above the error handler middleware
app.use(errorHandler);
export { app };
