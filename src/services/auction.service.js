import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { runTransaction } from "../utils/transaction.js";

const createAuctionDB = async (auctionData, sellerId) => {
    const auction = await Auction.create({
        name: auctionData.name,
        description: auctionData.description,
        startPrice: auctionData.startPrice,
        currentHighestBid: 0,
        bidCount: 0,
        status: "draft",
        startTime: auctionData.startTime,
        endedTime: undefined,
        media: auctionData.media,
        sellerId: sellerId,
        highestBidId: undefined,
        winnerId: undefined,
    });

    return auction;
};

const getAllAuctionsDB = async (filters, options) => {
    const { status, minPrice, maxPrice, sellerId, search } = filters;
    const { page, limit, order, sortBy } = options;

    const skip = (page - 1) * limit;

    const match = {};

    if (status) match.status = status;

    if (sellerId) match.sellerId = new mongoose.Types.ObjectId(sellerId);

    if (minPrice || maxPrice) {
        match.currentHighestBid = {};
        if (minPrice !== undefined) {
            match.currentHighestBid.$gte = minPrice;
        }

        if (maxPrice !== undefined) {
            match.currentHighestBid.$lte = maxPrice;
        }
    }

    if (search) match.name = { $regex: search, $options: "i" };

    const pipeline = [
        {
            $match: match,
        },
        {
            $sort: { [sortBy]: order === "asc" ? 1 : -1 },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    return await Auction.aggregate(pipeline);
};

const getsellerAuctionsDB = async (userId) => {
    const auctions = await Auction.find({ sellerId: userId });

    return auctions;
};

const getAuctionByIdDB = async (auctionId) => {
    const auction = await Auction.findById(auctionId);

    return auction;
};

const getActiveAuctionsDB = async () => {
    const activeAuctions = await Auction.find({
        status: "active",
    });

    return activeAuctions;
};

const updateAuctionDB = async (auctionId, userId, newdata) => {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new ApiError(404, "Auction not found");
    if (auction.status !== "draft")
        throw new ApiError(400, "Only draft auctions are updatable");

    if (auction.sellerId.toString() !== userId)
        throw new ApiError(403, "Unauthorized to update auction");

    Object.assign(auction, newdata);

    await auction.save();

    return auction;
};

const startAuctionDB = async (auctionId, userId) => {
    const auction = await Auction.findOneAndUpdate(
        {
            _id: auctionId,
            sellerId: userId,
            status: "draft",
        },
        { $set: { status: "active" } },
        { returnDocument: "after" }
    );

    return auction;
};

const endAuctionDB = async (auctionId, userId) => {
    return await runTransaction(async (session) => {
        const auction = await Auction.findOne({
            _id: auctionId,
            sellerId: userId,
            status: "active",
        }).session(session);

        if (!auction) {
            throw new ApiError(404, "Auction not found");
        }

        if (auction.status !== "active") {
            throw new ApiError(400, "Auction is not active");
        }
        auction.endedTime = new Date();

        const highestBid = await Bid.findById(auction.highestBidId).session(
            session
        );

        if (!highestBid) {
            auction.status = "expired"; // or expired

            await auction.save({ session });
            return auction;
        }
        auction.winnerId = highestBid.userId;
        auction.status = "ended";

        await auction.save({ session });
        return auction;
    });
};

export {
    createAuctionDB,
    getAllAuctionsDB,
    getsellerAuctionsDB,
    getAuctionByIdDB,
    updateAuctionDB,
    getActiveAuctionsDB,
    startAuctionDB,
    endAuctionDB,
};
