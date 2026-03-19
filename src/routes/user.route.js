import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { validateData } from "../middlewares/validate.middleware.js";
import {
    userRegisterSchema,
    updateUserSchema,
} from "../validation/user.validation.js";
const router = Router();

router.route("/register").post(validateData(userRegisterSchema), registerUser);

export default router;
