import { z } from "zod";
import { objectId } from "../validation/order.validator.js";
const bidValidator = z
    .object({
        auctionId: objectId,
        amount: z.number().min(1000, "Bid must be at least 1000"),
    })
    .strict();

export { bidValidator };
