import { Bid } from "../models/bid.model.js";
import { Auction } from "../models/auction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { runTransaction } from "../utils/transaction.js";
import { scheduleAuctionEnd } from "../utils/scheduleAuctionEnd.js";
import { io } from "../index.js";
import mongoose from "mongoose";

const createBidDB = async (auctionId, userId, amount) => {
    if (!mongoose.Types.ObjectId.isValid(auctionId))
        throw new ApiError(400, "Invalid auction id");

    return await runTransaction(async (session) => {
        // console.log(
        //     `Auction Id: ${auctionId}, Amount: ${amount}, userId: ${userId}`
        // );
        const auction = await Auction.findOneAndUpdate(
            {
                _id: auctionId,
                status: "active",
                sellerId: { $ne: userId },
                currentHighestBid: { $lt: amount },
            },
            {
                $set: {
                    currentHighestBid: amount,
                    countdownEnd: new Date(Date.now() + 30 * 1000),
                },
                $inc: { bidCount: 1 },
            },
            { returnDocument: "after", session }
        );
        if (!auction)
            throw new ApiError(400, "Bid failed (outbid or auction expired)");

        if (!auction || !auction._id)
            throw new ApiError(400, "Bid failed (outbid or auction expired)");

        const bid = new Bid({
            auctionId,
            userId,
            amount,
        });
        await bid.save({ session });

        auction.highestBidId = bid._id;

        await auction.save({ session });

        // io.to(auctionId).emit("newBid", {
        //     auctionId,
        //     amount,
        //     user: req.user._id,
        // });

        scheduleAuctionEnd(auction._id, auction.countdownEnd);

        return bid;
    });
};

const highestBidDB = async (auctionId) => {
    const bid = await Bid.getHighestBid(auctionId);
    if (!bid) throw new ApiError(404, "No bid found");
    return bid;
};

const highestUserBidDB = async (userId, auctionId) => {
    const bid = await Bid.findOne({ userId, auctionId }).sort({ amount: -1 });
    if (!bid) throw new ApiError(404, "No bid found");
    return bid;
};

const deleteBidDB = async (bidId) => {
    const bid = await Bid.findByIdAndDelete(bidId);
    if (!bid) throw new ApiError(404, "No bid found");
    return bid;
};

const bidDB = async (bidId) => {
    const bid = await Bid.findOne(bidId)
        .populate("auctionId")
        .populate("userId");
    if (!bid) throw new ApiError(404, "No bid found");
    return bid;
};

const userBidsDB = async (userId) => {
    const bids = await Bid.find({ userId })
        .populate("auctionId")
        .sort({ createdAt: -1 });

    if (!bids) throw new ApiError(404, "No bids found");
    return bids;
};

const auctionBidsDB = async (auctionId) => {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new ApiError(404, "Auction not found");
    const bids = await Bid.find({ auctionId });
    return bids;
};
export {
    createBidDB,
    highestBidDB,
    auctionBidsDB,
    userBidsDB,
    bidDB,
    deleteBidDB,
    highestUserBidDB,
};
