import express from "express";
import { verifyOTP, resendOTP } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/verify", verifyOTP);
router.post("/resend", resendOTP);

export default router;
