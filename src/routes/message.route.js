import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/get", protect, getMessages);

router.post("/send", protect, sendMessage);

export default router;
