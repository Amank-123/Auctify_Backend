import { z } from "zod";
import { objectId } from "../validation/order.validator.js";
const auctionValidator = z
    .object({
        name: z
            .string()
            .min(5, "Name must be at least 5 characters")
            .max(50, "Name cannot exceed 50 characters")
            .trim(),

        description: z.string().max(500, "Description too long").optional(),

        startPrice: z.coerce
            .number()
            .min(1000, "Minimum amount should be at least 1000"),

        currentHighestBid: z.coerce
            .number()
            .min(0, "Bid cannot be negative")
            .optional()
            .default(0),

        bidCount: z.coerce
            .number()
            .min(0, "Bid count cannot be negative")
            .optional()
            .default(0),

        status: z
            .enum([
                "draft",
                "active",
                "ended",
                "payment_pending",
                "completed",
                "cancelled",
                "expired",
                "failed",
            ])
            .optional()
            .default("draft"),

        startTime: z.coerce.date({
            required_error: "Start time is required",
        }),

        endedTime: z.coerce.date().optional(),

        media: z
            .array(z.string().url("Media must be valid URL"))
            .max(10, "You can upload up to 10 media files only")
            .optional(),

        sellerId: objectId,

        highestBidId: objectId.optional(),

        winnerId: objectId.optional(),
    })
    .strict()

    .refine(
        (data) => {
            // endedTime must be after startTime
            if (data.endedTime) {
                return data.endedTime > data.startTime;
            }
            return true;
        },
        {
            message: "End time must be after start time",
            path: ["endedTime"],
        }
    )
    .refine(
        (data) => {
            // if status is active → startTime must be in past
            if (data.status === "active") {
                return data.startTime <= new Date();
            }
            return true;
        },
        {
            message: "Active auction must have start time in the past",
            path: ["startTime"],
        }
    );

import { z } from "zod";

const updateAuctionValidator = z
    .object({
        name: z
            .string()
            .min(5, "Name must be at least 5 characters")
            .max(50, "Name cannot exceed 50 characters")
            .trim()
            .optional(),

        description: z.string().max(500, "Description too long").optional(),

        startPrice: z.coerce
            .number()
            .min(1000, "Minimum amount should be at least 1000")
            .optional(),

        media: z
            .array(z.string().url("Media must be valid URL"))
            .max(10, "Max 10 media files")
            .optional(),
    })
    .strict(); // blocks any other fields

export { auctionValidator, updateAuctionValidator };
