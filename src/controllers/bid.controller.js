import {
    createBidDB,
    highestBidDB,
    auctionBidsDB,
    userBidsDB,
    bidDB,
    deleteBidDB,
    highestUserBidDB,
} from "../services/bid.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBid = asyncHandler(async (req, res) => {
    const data = await createBidDB(
        req.params.auctionId,
        req.user._id,
        req.body.amount
    );

    if (!data) throw new ApiError(500, "Bid failed");

    ApiResponse(res, 201, "Bid created successfully !!!", data);
});

const highestBid = asyncHandler(async (req, res) => {
    const data = await highestBidDB(req.params.auctionId);

    ApiResponse(res, 200, "Highest bid fetched successfully !!!", data);
});

const highestUserBid = asyncHandler(async (req, res) => {
    const data = await highestUserBidDB(req.user._id, req.params.auctionId);
    ApiResponse(res, 200, "Highest user bid fetched successfully !!!", data);
});
const deleteBid = asyncHandler(async (req, res) => {
    const data = await deleteBidDB(req.params.bidId);
    ApiResponse(res, 200, "Bid deleted successfully !!!", data);
});

const bid = asyncHandler(async (req, res) => {
    const data = await bidDB(req.params.bidId);
    ApiResponse(res, 200, "Bid fetched successfully !!!", data);
});

const userBids = asyncHandler(async (req, res) => {
    const data = await userBidsDB(req.user._id);
    ApiResponse(res, 200, "Bid fetched successfully !!!", data);
});

const auctionBids = asyncHandler(async (req, res) => {
    const data = await auctionBidsDB(req.params.auctionId);
    ApiResponse(res, 200, "Bid fetched successfully !!!", data);
});

export {
    createBid,
    highestBid,
    auctionBids,
    userBids,
    bid,
    deleteBid,
    highestUserBid,
};
