import { z } from "zod";

const addressSchema = z.object({
    street: z
        .string()
        .trim()
        .min(2, "Street is too short")
        .max(50, "Street is too long"),

    city: z
        .string()
        .trim()
        .min(2, "City is too short")
        .regex(/^[a-zA-Z\s.'-]+$/, "Invalid city name"),

    state: z
        .string()
        .trim()
        .min(2, "State is too short")
        .regex(/^[a-zA-Z\s.'-]+$/, "Invalid state name"),

    country: z
        .string()
        .trim()
        .min(2, "Country is too short")
        .regex(/^[a-zA-Z\s.'-]+$/, "Invalid country name"),

    pin: z
        .string()
        .trim()
        .regex(/^[0-9]{6}$/, "PIN must be 6 digits"),
});

const userRegisterSchema = z.object({
    body: z
        .object({
            username: z
                .string({ required_error: "Username is required" })
                .trim()
                .regex(/^\S+$/, "Username must not contain spaces")
                .toLowerCase()
                .min(3, "username should be more than 3 characters")
                .max(20, "username should be less than 20 characters"),
            firstName: z
                .string()
                .min(3, "First name should be more than 3 characters")
                .max(20, "First name should be less than 20 characters")
                .optional(),
            lastName: z
                .string()
                .min(3, "Last name should be more than 3 characters")
                .max(20, "Last name should be less than 20 characters")
                .optional(),
            email: z.email("Invalid email format").toLowerCase(),
            password: z
                .string({ required_error: "Password is required" })
                .trim()
                .min(8, "Password must contain atleast 8 characters")
                .max(50, "Password can't be greater than 50 characters"),
            address: addressSchema.optional(),
        })
        .strict(),
});

const updateUserSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .trim()
                .regex(/^\S+$/, "Username must not contain spaces")
                .lowercase()
                .min(3, "Full name should be more than 3 characters")
                .max(20, "Full name should be less than 20 characters")
                .optional(),
            email: z.email("Invalid email format").lowercase().optional(),
            firstName: z
                .string()
                .min(3, "First name should be more than 3 characters")
                .max(20, "First name should be less than 20 characters")
                .optional(),
            lastName: z
                .string()
                .min(3, "Last name should be more than 3 characters")
                .max(20, "Last name should be less than 20 characters")
                .optional(),
            address: addressSchema.partial().optional(),
        })
        .refine(
            (data) =>
                Object.keys(data).some((key) => {
                    const value = data[key];
                    return (
                        value !== undefined &&
                        value !== null &&
                        (typeof value !== "object" ||
                            Object.keys(value).length > 0)
                    );
                }),
            {
                message: "At least one valid field must be provided",
            }
        ),
});

export { addressSchema, userRegisterSchema, updateUserSchema };
