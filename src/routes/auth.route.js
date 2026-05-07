import { Router } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    oauthCallback,
    forgotPassword,
    resetForgottenPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import passport from "../config/passport.js";
import { authLimiter } from "../limiters/auth.limiter.js";
import { oauthLimiter } from "../limiters/oauth.limiter.js";
import { userRegisterSchema } from "../validation/user.validation.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/multer.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";

const router = Router();

router
    .route("/register")
    .post(authLimiter, validateData(userRegisterSchema), registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/refresh").post(authLimiter, refreshAccessToken);
router.route("/forgot-password").post(authLimiter, forgotPassword);
router.route("/reset-password").post(authLimiter, resetForgottenPassword);

router.route("/logout").post(protect, protectedApiLimiter, logoutUser);

//google Oauth routes
router.route("/google").get(
    oauthLimiter,
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
    .get(
        oauthLimiter,
        passport.authenticate("github", { scope: ["user:email"] })
    );
router
    .route("/github/callback")
    .get(passport.authenticate("github", { session: false }), oauthCallback);

export default router;
