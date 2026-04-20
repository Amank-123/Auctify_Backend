import { z } from "zod";
const auctionCreateValidator = z
    .object({
        name: z
            .string()
            .min(5, "Name must be at least 5 characters")
            .max(50, "Name cannot exceed 50 characters")
            .trim(),

        description: z.string().max(500).optional(),

        startPrice: z.coerce
            .number()
            .min(1000, "Minimum amount should be at least 1000"),

        startTime: z.coerce.date({
            required_error: "Start time is required",
        }),

        media: z
            .array(z.string().url("Media must be valid URL"))
            .max(10, "You can upload up to 10 media files only")
            .optional(),
        category: z.string()
    })
    .strict();

const updateAuctionValidator = z
    .object({
        name: z
            .string()
            .min(5, "Name must be at least 5 characters")
            .max(50, "Name cannot exceed 50 characters")
            .trim()
            .optional(),

        description: z.string().max(500, "Description too long").optional(),
        startTime: z.coerce.date({
            required_error: "Start time is required",
        }),
        startPrice: z.coerce
            .number()
            .min(1000, "Minimum amount should be at least 1000")
            .optional(),

        media: z
            .array(z.url("Media must be valid URL"))
            .max(10, "Max 10 media files")
            .optional(),
    })
    .strict();

export { updateAuctionValidator, auctionCreateValidator };
