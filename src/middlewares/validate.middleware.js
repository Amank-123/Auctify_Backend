import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const validateData = (schema) =>
    asyncHandler((req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success)
            throw new ApiError(400, result.error.issues[0].message);

        req.body = result.data;

        next();
    });
