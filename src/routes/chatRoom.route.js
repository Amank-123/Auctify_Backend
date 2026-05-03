import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getMyChatRooms,
    getMyChatRoom,
} from "../controllers/chatRoom.controller.js";

const router = express.Router();

router.get("/getRooms", protect, getMyChatRooms);
router.post("/getRoom", protect, getMyChatRoom);

export default router;
