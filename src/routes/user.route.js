import { Router } from "express";
import { registerUser, updateUser } from "../controllers/user.controller.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    userRegisterSchema,
    updateUserSchema,
} from "../validation/user.validation.js";
const router = Router();

router.route("/register").post(validateData(userRegisterSchema), registerUser);
router
    .route("/update")
    .post(protect, validateData(updateUserSchema), updateUser);

export default router;
