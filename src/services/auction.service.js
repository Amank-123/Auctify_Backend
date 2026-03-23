import { Auction } from "../models/auction.model.js";
import { ApiError } from "../utils/ApiError.js";

const createAuctionDB = async (auctionData) => {
    const auction = await Auction.create(auctionData);

    return auction;
};

const getAllAuctionsDB = async () => {
    const allAuctions = await Auctions.findAll();

    return allAuctions;
};

const getAllUserAuctionsDB = async (userId) => {
    const auctions = await Auction.findAll({ sellerId: userId });

    return auctions;
};

const getAuctionByIdDB = async (auctionId) => {
    const auction = await Auction.findById(auctionId);

    return auction;
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
