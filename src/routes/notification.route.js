import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    addNotification,
    getNotification,
    broadCastNotification,
    markAsReadNotification,
    markAllAsReadNotification,
    deleteNotification,
} from "../controllers/notification.controller.js";
import isAdmin from "../middlewares/autherised.js";

const router = express.Router();

router.route("/push").post(protect, addNotification);
router.route("/").get(protect, getNotification);
router.route("/broadCast").post(protect, isAdmin, broadCastNotification);
router.route("/readAll").post(protect, markAllAsReadNotification);
router.route("/:id").post(protect, markAsReadNotification);
router.route("/delete/:id").post(protect, deleteNotification);

export default router;
