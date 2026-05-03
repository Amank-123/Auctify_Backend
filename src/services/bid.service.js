import { Bid } from "../models/bid.model.js";
import { Auction } from "../models/auction.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { runTransaction } from "../utils/transaction.js";
import { scheduleAuctionEnd } from "../utils/scheduleAuctionEnd.js";
import { io } from "../index.js";
import mongoose from "mongoose";
import { emitEvent } from "../socket/events.js";
import { addNotificationDB } from "../services/notification.service.js";

const createBidDB = async (io, auctionId, userId, amount) => {
    if (!mongoose.Types.ObjectId.isValid(auctionId))
        throw new ApiError(400, "Invalid auction id");
    const bidder = await User.findById(userId);
    return await runTransaction(async (session) => {
        const auction = await Auction.findById(auctionId)
            .populate({
                path: "highestBidId",
                populate: {
                    path: "userId",
                },
            })
            .session(session);
        const image = auction.media?.[0]?.[0] || "";

        // console.log("Auction : " + auction);
        // console.log("user id(userId)" + userId);
        // console.log(
        //     "auction highest bid user id(auction.highestBidId.userId)" +
        //         auction.highestBidId.userId
        // );
        // console.log(
        //     "auction highest bid (auction.highestBidId)" + auction.highestBidId
        // );
        // console.log("auction media (auction.media)" + auction.media);
        console.log("image" + image);

        if (auction.sellerId.toString() === userId.toString()) {
            throw new ApiError(400, "Can't bid in your own auction");
        }

        const highestBidUserId = auction.highestBidId?.userId?._id
            ? auction.highestBidId.userId._id.toString()
            : auction.highestBidId?.userId?.toString();

        if (highestBidUserId === userId.toString()) {
            throw new ApiError(400, "Can't bid against your own bid");
        }

        const updatedAuction = await Auction.findOneAndUpdate(
            {
                _id: auctionId,
                status: "active",
                sellerId: { $ne: userId },
                currentHighestBid: { $lt: amount },
            },
            {
                $set: {
                    currentHighestBid: amount,
                    countdownEnd: new Date(Date.now() + 60 * 1000),
                },
                $inc: { bidCount: 1 },
            },
            { returnDocument: "after", session }
        );

        if (!updatedAuction)
            throw new ApiError(400, "Bid failed (outbid or auction expired)");

        const bid = new Bid({ auctionId, userId, amount });
        await bid.save({ session });

        updatedAuction.highestBidId = bid._id;
        await updatedAuction.save({ session });

        await updatedAuction.populate([
            { path: "sellerId" },
            {
                path: "highestBidId",
                populate: { path: "userId" },
            },
        ]);

        emitEvent(io, auctionId, "BID_CREATED", updatedAuction);
        await addNotificationDB(auction.sellerId, {
            type: "newBid",
            title: "New Bid Placed",
            message: `A new bid of ₹${amount} has been placed on your auction by ${bidder.username}.`,
            auction: auction._id,
            image: image,
            ctaLink: `/auction/${auction._id}`,
        });

        if (auction.highestBidId?.userId) {
            await addNotificationDB(auction.highestBidId.userId, {
                type: "outbid",
                title: "You are outbidded",
                message: `You are now outbid with ₹${amount} by ${bidder.username}`,
                auction: auction._id,
                image: image,
                ctaLink: `/auction/${auction._id}`,
            });
        }

        if (updatedAuction.auctionType === "short") {
            scheduleAuctionEnd(updatedAuction._id, updatedAuction.countdownEnd);
        }

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
    const bids = await Bid.find({ auctionId }).populate("userId");
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
