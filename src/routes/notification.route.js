import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    addNotification,
    getNotification,
    broadCastNotification,
    markAsReadNotification,
    markAllAsReadNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/push").post(protect, addNotification);
router.route("/").get(protect, getNotification);
router.route("/broadCast").post(protect, broadCastNotification);
router.route("/readAll").post(protect, markAllAsReadNotification);
router.route("/:id").post(protect, markAsReadNotification);

export default router;
