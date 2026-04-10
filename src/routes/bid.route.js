import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
    createBid,
    highestBid,
    auctionBids,
    userBids,
    bid,
    deleteBid,
    highestUserBid,
} from "../controllers/bid.controller.js";
import { bidValidator } from "../validation/bid.validator.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";
import { publicApiLimiter } from "../limiters/publicApi.limiter.js";

const router = express.Router();

router
    .route("/")
    .post(protect, protectedApiLimiter, validateData(bidValidator), createBid)
    .get(protect, protectedApiLimiter, userBids);
router.route("/auction/:auctionId").get(publicApiLimiter, auctionBids);
router.route("/highest/:auctionId").get(publicApiLimiter, highestBid);
router
    .route("/my-highest/:auctionId")
    .get(protect, protectedApiLimiter, highestUserBid);
router
    .route("/:bidId")
    .get(publicApiLimiter, bid)
    .delete(protect, protectedApiLimiter, deleteBid);

export default router;
