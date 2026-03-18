import { Router } from "express";
import {
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/logout").post(protect, logoutUser);

export default router;
