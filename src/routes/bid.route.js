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

const router = express.Router();

router.route("/").post(protect, createBid).get(protect, userBids);
router.route("/auction/:auctionId").get(auctionBids);
router.route("/highest/:auctionId").get(highestBid);
router.route("/my-highest/:auctionId").get(protect, highestUserBid);
router.route("/:bidId").get(bid).delete(protect, deleteBid);

export default router;
