import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import passport from "passport";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import auctionRouter from "./routes/auction.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

//Routes middlewares
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/auction", auctionRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
//All routes should be above the error handler middleware
app.use(errorHandler);
export { app };
