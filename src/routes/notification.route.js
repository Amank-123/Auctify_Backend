import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    addNotification,
    getNotification,
    broadCastNotification,
    markAsReadNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/push").post(protect, addNotification);
router.route("/broadCast").post(protect, broadCastNotification);
router.route("/:id").post(protect, markAsReadNotification);
router.route("/").get(protect, getNotification);

export default router;
