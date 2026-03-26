import { Auction } from "../models/bid.model.js";

const createBid = async (auctionId, userId, amount) => {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new ApiError(404, "Auction not found");
    if (auction.sellerId.toString() === userId.toString())
        throw new ApiError(403, "Seller can't bid to there own auction");

    const highestBid = await Bid.getHighestBid(auctionId);
    if (highestBid && amount <= highestBid.amount)
        throw new ApiError(403, "Amount should be higher than highest bid");
    const bid = await Bid.create({
        auctionId,
        userId,
        amount,
    });

    return bid;
};
