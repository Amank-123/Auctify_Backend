import { z } from "zod";
import { addressSchema } from "./user.validation.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const orderValidator = z
    .object({
        auctionId: objectId,

        finalPrice: z.coerce.number().positive("Final price must be positive"),

        paymentStatus: z
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

        orderStatus: z
            .enum([
                "awaiting_payment",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ])
            .optional()
            .default("awaiting_payment"),

        buyerId: objectId,
        sellerId: objectId,

        paymentId: objectId.optional(),

        shippingAddress: addressSchema.optional(),
    })
    .refine(
        (data) => {
            if (
                data.orderStatus === "shipped" ||
                data.orderStatus === "delivered"
            ) {
                return data.shippingAddress;
            }
            return true;
        },
        {
            message: "Shipping address required for shipped/delivered orders",
            path: ["shippingAddress"],
        }
    );

export { orderValidator, objectId };
