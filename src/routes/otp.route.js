import express from "express";
import {
    verifyOTP,
    resendOTP,
    verifyForgotPasswordOTP,
} from "../controllers/otp.controller.js";
import { publicApiLimiter } from "../limiters/publicApi.limiter.js";

const router = express.Router();

router.post("/verify", publicApiLimiter, verifyOTP);
router.post("/resend", publicApiLimiter, resendOTP);
router.post("/verify-forgot", publicApiLimiter, verifyForgotPasswordOTP);

export default router;
