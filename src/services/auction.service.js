import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const createAuctionDB = async (auctionData) => {
    const auction = await Auction.create(auctionData);

    return auction;
};

const getAllAuctionsDB = async (filters, options) => {
    const { status, minPrice, maxPrice, sellerId, search } = filters;
    const { page, limit, order = "des", sortBy = "createdAt" } = options;

    const skip = (page - 1) * limit;

    const match = {};

    if (status) match.status = status;

    if (sellerId) match.sellerId = new mongoose.Types.ObjectId(sellerId);

    if (minPrice || maxPrice) {
        match.currentHighestBid = {};
        match.currentHighestBid.$gte = minPrice;
        match.currentHighestBid.$lt = maxPrice;
    }

    if (search) match.name = { $regex: search, $options: "i" };

    const pipeline = [
        {
            $match: match,
        },
        {
            $sort: { [sortBy]: order === "asd" ? 1 : -1 },
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
    const auctions = await Auction.findAll({ sellerId: userId });

    return auctions;
};

const getAuctionByIdDB = async (auctionId) => {
    const auction = await Auction.findById(auctionId);

    return auction;
};

const getActiveAuctionsDB = async () => {
    const activeAuctions = await Auction.find({
        status: "active",
        startTime: { $gte: new Date() },
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
    const auction = await Auction.findOne({
        _id: auctionId,
        sellerId: userId,
    });

    const highestBid = await Bid.findById(auction.highestBidId);

    auction.winnerId = highestBid.userId;

    auction.endedTime = new Date();

    auction.save();

    return auction;
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
