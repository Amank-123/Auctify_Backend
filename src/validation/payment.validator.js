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
            .default("pending"),
        amount: z.number().positive("Amount must be positive"),
        paymentMethod: z.enum(["card", "upi", "netbanking"], {
            required_error: "Payment method is required",
        }),
        gateway: z.object({
            name: z.string(),
            transactionId: objectId,
        }),
        failureReason: z.string().optional(),
        current: z.string().default("INR").optional(),
    })
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
