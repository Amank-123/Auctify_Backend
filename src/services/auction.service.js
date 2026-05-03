import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { runTransaction } from "../utils/transaction.js";
import handleViolation from "../utils/handleViolation.js";
import uploadToCloudinary from "../utils/cloudinaryUploader.js";
import {
    scheduleAuctionEnd,
    scheduleAuctionStart,
} from "../utils/scheduleAuctionEnd.js";
import { emitEvent } from "../socket/events.js";
import { addNotificationDB } from "../services/notification.service.js";
import { ChatRoom } from "../models/chatRoom.model.js";

const createAuctionDB = async (auctionData, sellerId, files) => {
    if (!files || files.length === 0) {
        throw new Error("At least one media file required");
    }
    let mediaArr = [];
    for (const file of files) {
        const media = await uploadToCloudinary(file.buffer, file.mimetype);
        console.log("Mime type:", file.mimetype);
        mediaArr.push(media.secure_url);
    }
    const auction = await Auction.create({
        name: auctionData.name,
        description: auctionData.description,
        startPrice: auctionData.startPrice,
        currentHighestBid: 0,
        bidCount: 0,
        status: "draft",
        auctionType: auctionData.auctionType,
        startTime: auctionData.startTime,
        endTime: auctionData.endTime,
        endedTime: undefined,
        media: mediaArr,
        sellerId: sellerId,
        highestBidId: undefined,
        winnerId: undefined,
        category: auctionData.category,
    });

    await scheduleAuctionStart(auction._id, auction.startTime);

    return auction;
};

const getAllAuctionsDB = async (filters, options) => {
    const {
        status,
        minPrice,
        maxPrice,
        sellerId,
        search,
        category,
        auctionType,
    } = filters;
    const { page, limit, order, sortBy } = options;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const match = {};

    if (status) match.status = status;

    const ALLOWED_CATEGORIES = [
        "electronics",
        "fashion",
        "jewelry",
        "watches",
        "vehicles",
        "real_estate",
        "art",
        "collectibles",
        "furniture",
        "books",
        "sports",
        "gaming",
        "music",
        "antiques",
        "toys",
        "luxury",
        "industrial",
        "other",
    ];

    const normalizedCategory = category?.toLowerCase().trim();

    if (normalizedCategory && ALLOWED_CATEGORIES.includes(normalizedCategory)) {
        match.category = normalizedCategory;
    }

    if (sellerId && mongoose.Types.ObjectId.isValid(sellerId)) {
        match.sellerId = new mongoose.Types.ObjectId(sellerId);
    }

    if (auctionType) {
        match.auctionType = auctionType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        match.currentHighestBid = {};
        if (minPrice !== undefined) {
            match.currentHighestBid.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
            match.currentHighestBid.$lte = Number(maxPrice);
        }
    }

    if (search) {
        const escapeRegex = (text) =>
            text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        match.name = {
            $regex: escapeRegex(search),
            $options: "i",
        };
    }

    const allowedSortFields = ["createdAt", "currentHighestBid", "name"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const pipeline = [
        { $match: match },
        {
            $lookup: {
                from: "users",
                localField: "sellerId",
                foreignField: "_id",
                as: "seller",
            },
        },
        {
            $unwind: {
                path: "$seller",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $sort: { [sortField]: order === "asc" ? 1 : -1 } },
        { $skip: skip },
        { $limit: safeLimit },
    ];

    return await Auction.aggregate(pipeline);
};

const getsellerAuctionsDB = async (userId) => {
    const auctions = await Auction.find({ sellerId: userId });

    return auctions;
};

const getAuctionByIdDB = async (auctionId) => {
    const auction = await Auction.findById(auctionId).populate("sellerId");

    return auction;
};

const getActiveAuctionsDB = async () => {
    const activeAuctions = await Auction.findActiveAuctions();

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

const startAuctionDB = async (auctionId, io = null) => {
    const auction = await Auction.findOneAndUpdate(
        {
            _id: auctionId,
            status: "draft",
        },
        { $set: { status: "active" } },
        { new: true }
    );

    if (auction.auctionType === "long") {
        scheduleAuctionEnd(auctionId, auction.endTime);
    }

    await auction.populate("sellerId");

    console.log("Inside IO:", io);
    if (io) {
        console.log("Entered in a socket block startAuctionDB");
        emitEvent(io, auctionId, "AUCTION_STARTED", auction);
    }

    return auction;
};

const endAuctionDB = async (auctionId, io = null) => {
    return await runTransaction(async (session) => {
        const auction = await Auction.findOne({
            _id: auctionId,
            status: "active",
        }).session(session);

        if (!auction) {
            throw new ApiError(404, "Auction not found");
        }

        if (!auction.isActive()) {
            throw new ApiError(400, "Auction is not active");
        }

        auction.endedTime = new Date();

        const highestBid = await Bid.findById(auction.highestBidId).session(
            session
        );

        // No bids
        if (!highestBid) {
            auction.status = "expired";

            await auction.save({ session });

            return auction;
        }

        // Winner found
        auction.winnerId = highestBid.userId;
        auction.status = "ended";

        await auction.save({ session });

        // Create / reuse room
        const room = await ChatRoom.findOneAndUpdate(
            {
                auctionId: auction._id,
            },
            {
                auctionId: auction._id,
                sellerId: auction.sellerId,
                buyerId: highestBid.userId,
                isActive: true,
            },
            {
                upsert: true,
                new: true,
                session,
            }
        );

        await auction.populate("sellerId");

        // Winner notify
        await addNotificationDB(io, highestBid.userId.toString(), {
            type: "won",
            title: "You won the auction!",
            message: `Congratulations! You won ${auction.title}. Start chat with seller.`,
            auction: auction._id,
            ctaLink: `/chat/${room._id}`,
        });

        // Seller notify
        await addNotificationDB(io, auction.sellerId._id.toString(), {
            type: "sold",
            title: "Your item has been sold!",
            message: `${auction.title} has ended successfully. Contact buyer now.`,
            auction: auction._id,
            ctaLink: `/chat/${room._id}`,
        });

        if (io) {
            emitEvent(io, auctionId, "AUCTION_ENDED", auction);
        }

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
