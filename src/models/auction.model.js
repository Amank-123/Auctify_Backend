import mongoose, { Schema } from "mongoose";

const auctionSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Auction name is required"],
            minlength: [5, "Name must be at least 5 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description too long"],
        },

        startPrice: {
            type: Number,
            required: [true, "Start price is required"],
            min: [1000, "Minimum amount should be at least 1000"],
        },

        currentHighestBid: {
            type: Number,
            default: 0,
            min: [0, "Bid cannot be negative"],
        },
        countdownEnd: {
            type: Date,
        },
        bidCount: {
            type: Number,
            default: 0,
            min: [0, "Bid count cannot be negative"],
        },

        status: {
            type: String,
            enum: {
                values: [
                    "draft",
                    "active",
                    "ended",
                    "payment_pending",
                    "completed",
                    "cancelled",
                    "expired",
                    "failed",
                ],
                message: "Invalid auction status",
            },
            default: "draft",
        },

        startTime: {
            type: Date,
            required: [true, "Start time is required"],
        },

        endTime: {
            type: Date,
            required: [
                function () {
                    return this.auctionType === "long";
                },
                "End time is required for long auctions",
            ],
        },

        endedTime: {
            type: Date,
        },
        media: [
            {
                type: [String],
                validate: {
                    validator: (arr) => arr.length <= 10,
                    message: "You can upload up to  media files only",
                },
            },
        ],

        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        highestBidId: {
            type: Schema.Types.ObjectId,
            ref: "Bid",
        },

        winnerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        auctionType: {
            type: String,
            enum: {
                values: ["short", "long"],
                message: "Auction type can only be short or long",
            },
            default: "long",
            required: true,
        },

        category: {
            type: String,
            enum: {
                values: [
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
                ],
                message: "Invalid item category",
            },
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ sellerId: 1 });
auctionSchema.index({ winnerId: 1 });

auctionSchema.methods.isActive = function () {
    return this.status === "active" && !this.endedTime;
};

auctionSchema.statics.findActiveAuctions = function () {
    return this.find({
        status: "active",
    });
};

export const Auction = mongoose.model("Auction", auctionSchema);
