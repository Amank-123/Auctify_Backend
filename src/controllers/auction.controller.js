import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createAuctionDB,
    getAllAuctionsDB,
    getsellerAuctionsDB,
    getAuctionByIdDB,
    updateAuctionDB,
    getActiveAuctionsDB,
    startAuctionDB,
    endAuctionDB,
} from "../services/auction.service.js";

const createAuction = asyncHandler(async (req, res) => {
    const data = await createAuctionDB(req.body, req.user._id, req.files);

    if (!data) throw new ApiError(500, "Failed to create the auction");

    return ApiResponse(res, 201, "Auction created successfully", data);
});

const getAllAuctions = asyncHandler(async (req, res) => {
    const {
        status,
        minPrice,
        maxPrice,
        sellerId,
        search,
        page,
        limit,
        sortBy,
        category,
        order,
        auctionType,
    } = req.query;

    const filters = {
        status,
        category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sellerId,
        search,
    };
    const options = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        order,
        sortBy,
    };

    const result = await getAllAuctionsDB(filters, options);

    return ApiResponse(
        res,
        200,
        `Found ${result.length} auctions matching the request`,
        result
    );
});

const getsellerAuctions = asyncHandler(async (req, res) => {
    const data = await getsellerAuctionsDB(req.user._id);

    if (data.length === 0) throw new ApiError(404, "Auctions not found");

    return ApiResponse(res, 200, "Auctions found successfully", data);
});

const getAuctionById = asyncHandler(async (req, res) => {
    const auctionId = req.params.id;
    const data = await getAuctionByIdDB(auctionId);

    if (!data) throw new ApiError(404, "Auction not found");

    return ApiResponse(res, 200, "Auction found successfully", data);
});

const updateAuction = asyncHandler(async (req, res) => {
    const auctionId = req.params.id;
    const data = await updateAuctionDB(auctionId, req.user._id, req.body);

    if (!data) throw new ApiError(404, "Auction not found");

    return ApiResponse(res, 200, "Auction updated successfully", data);
});

const getActiveAuctions = asyncHandler(async (req, res) => {
    const data = await getActiveAuctionsDB();

    if (!data) throw new ApiError(404, "No active auction found");

    return ApiResponse(res, 200, `Found ${data.length} live auctions`, data);
});

const startAuction = asyncHandler(async (req, res) => {
    const auctionId = req.params.id;
    const auction = await startAuctionDB(auctionId, req.user._id);

    if (!auction) throw new ApiError(404, "No auction found to start");
    if (auction.status !== "active")
        throw new ApiError(400, "Failed to start the auction");

    return ApiResponse(res, 200, "Auction is live now");
});

const endAuction = asyncHandler(async (req, res) => {
    const auctionId = req.params.id;
    const auction = await endAuctionDB(auctionId);

    if (auction.status === "active")
        throw new ApiError(500, "Failed to end the auction");

    if (auction.status === "expired") {
        return ApiResponse(res, 200, "Auction ended with no bids");
    }
    if (auction.status === "ended") {
        return ApiResponse(
            res,
            200,
            "Ended the auction and announced the winner",
            auction
        );
    }
});

export {
    createAuction,
    getAllAuctions,
    getsellerAuctions,
    getAuctionById,
    updateAuction,
    getActiveAuctions,
    startAuction,
    endAuction,
};
