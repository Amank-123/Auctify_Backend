import { Router } from "express";
import {
    loginUser,
    refreshAccessToken,
    logoutUser,
    oauthCallback,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import passport from "../config/passport.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/logout").post(protect, logoutUser);

//google Oauth routes
router.route("/google").get(
    passport.authenticate("google", {
        scope: ["openid", "profile", "email"],
    })
);
router
    .route("/google/callback")
    .get(passport.authenticate("google", { session: false }), oauthCallback);

//git Oauth routes
router
    .route("/github")
    .get(passport.authenticate("github", { scope: ["user:email"] }));
router
    .route("/github/callback")
    .get(passport.authenticate("github", { session: false }), oauthCallback);

export default router;
