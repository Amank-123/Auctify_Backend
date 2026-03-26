import { Router } from "express";
import {
    registerUser,
    getUser,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    userRegisterSchema,
    updateUserSchema,
} from "../validation/user.validation.js";
const router = Router();

router
    .route("/")
    .get(protect, getUser)
    .post(validateData(userRegisterSchema), registerUser);
router
    .route("/update")
    .post(protect, validateData(updateUserSchema), updateUser);

router.route("/delete").post(protect, deleteUser);

export default router;
