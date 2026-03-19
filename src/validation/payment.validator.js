import { z } from "zod";
import { objectId } from "./order.validator.js";

const paymentValidator = z
    .object({
        userId: objectId,

        orderId: objectId,

        status: z
            .enum([
                "pending",
                "processing",
                "completed",
                "failed",
                "cancelled",
                "refunded",
            ])
            .optional()
            .default("pending"),

        amount: z.coerce.number().positive("Amount must be positive"),

        paymentMethod: z.enum(["card", "upi", "netbanking"], {
            required_error: "Payment method is required",
        }),

        gateway: z.object({
            name: z.string().min(1, "Gateway name is required"),
            transactionId: z.string().min(1, "Transaction ID is required"),
        }),

        failureReason: z.string().optional(),

        currency: z.string().optional().default("INR"),
    })
    .strict()
    .refine(
        (data) => {
            if (data.status === "failed") {
                return !!data.failureReason;
            }
            return true;
        },
        {
            message: "Failure reason is required when payment fails",
            path: ["failureReason"],
        }
    );

export { paymentValidator };
