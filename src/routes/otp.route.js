import express from "express";
import { verifyOTP, resendOTP } from "../controllers/otp.controller.js";
import { publicApiLimiter } from "../limiters/publicApi.limiter.js";

const router = express.Router();

router.post("/verify", publicApiLimiter, verifyOTP);
router.post("/resend", publicApiLimiter, resendOTP);

export default router;
 