import { Router } from "express";
import {
    getUser,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { updateUserSchema } from "../validation/user.validation.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";
const router = Router();

router.route("/").get(protect, protectedApiLimiter, getUser);
router
    .route("/update")
    .post(
        protect,
        protectedApiLimiter,
        validateData(updateUserSchema),
        updateUser
    );

router.route("/delete").post(protect, protectedApiLimiter, deleteUser);

export default router;
