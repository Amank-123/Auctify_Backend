import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const validateData = (schema) =>
    asyncHandler((req, res, next) => {
        console.log("REQ BODY:", req.body);

        const result = schema.safeParse(req.body);

        if (!result.success) {
            console.log(result.error.issues);

            throw new ApiError(400, result.error.issues[0].message);
        }

        req.body = result.data;
        next();
    });
