import { Router } from "express";
import {
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/logout").post(logoutUser);

export default router;
