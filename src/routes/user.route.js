import { Router } from "express";
import {
    getUser,
    updateUser,
    deleteUser,
    fetchWatchList,
    toggleWatchList,
    resetPassword,
} from "../controllers/user.controller.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { updateUserSchema } from "../validation/user.validation.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";
import { upload } from "../middlewares/multer.js";
const router = Router();

router.route("/").get(protect, protectedApiLimiter, getUser);
router
    .route("/update")
    .post(
        protect,
        protectedApiLimiter,
        upload.single("profile"),
        validateData(updateUserSchema),
        updateUser
    );

router.route("/watchList").get(protect, fetchWatchList);
router.route("/watchList/:auctionId").post(protect, toggleWatchList);
router.route("/delete").post(protect, protectedApiLimiter, deleteUser);
router
    .route("/resetPassword")
    .post(protect, protectedApiLimiter, resetPassword);

export default router;
