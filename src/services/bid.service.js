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
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new ApiError(400, "Invalid auction id");
    }

    const bidder = await User.findById(userId);

    if (!bidder) {
        throw new ApiError(404, "Bidder not found");
    }

    return await runTransaction(async (session) => {
        const auction = await Auction.findById(auctionId)
            .populate({
                path: "highestBidId",
                populate: {
                    path: "userId",
                    select: "_id username",
                },
            })
            .session(session);

        if (!auction) {
            throw new ApiError(404, "Auction not found");
        }

        const image = Array.isArray(auction.media?.[0])
            ? auction.media[0][0]
            : auction.media?.[0] || "";

        if (auction.sellerId.toString() === userId.toString()) {
            throw new ApiError(400, "Can't bid in your own auction");
        }

        const previousHighestBidderId =
            auction.highestBidId?.userId?._id?.toString() ||
            auction.highestBidId?.userId?.toString() ||
            null;

        if (previousHighestBidderId === userId.toString()) {
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
                $inc: {
                    bidCount: 1,
                },
            },
            {
                new: true,
                session,
            }
        );

        if (!updatedAuction) {
            throw new ApiError(
                400,
                "Bid failed (outbid already or auction expired)"
            );
        }

        const bid = new Bid({
            auctionId,
            userId,
            amount,
        });

        await bid.save({ session });

        updatedAuction.highestBidId = bid._id;
        await updatedAuction.save({ session });

        // await updatedAuction.populate([
        //     { path: "sellerId", select: "_id username" },
        //     {
        //         path: "highestBidId",
        //         populate: {
        //             path: "userId",
        //         },
        //     },
        // ]);
        // console.log("Updated auction from sevice :", updatedAuction);

        await bid.populate("userId auctionId");

        emitEvent(io, auctionId, "BID_CREATED", bid);

        await addNotificationDB(io, auction.sellerId.toString(), {
            type: "newBid",
            title: "New Bid Placed",
            message: `A new bid of ₹${amount} has been placed on your auction by ${bidder.username}.`,
            auction: auction._id,
            image,
            ctaLink: `/auction/${auction._id}`,
        });

        if (previousHighestBidderId) {
            await addNotificationDB(io, previousHighestBidderId, {
                type: "outbid",
                title: "You are outbid",
                message: `You are now outbid with ₹${amount} by ${bidder.username}.`,
                auction: auction._id,
                image,
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
