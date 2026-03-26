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

        endedTime: {
            type: Date,
        },

        media: {
            type: [String],
            validate: {
                validator: (arr) => arr.length <= 10,
                message: "You can upload up to  media files only",
            },
        },

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
