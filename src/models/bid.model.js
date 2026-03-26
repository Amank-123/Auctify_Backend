import mongoose, { Schema } from "mongoose";

const bidSchema = new Schema(
    {
        auctionId: {
            type: Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: [true, "Bid amount is required"],
            min: [1000, "Bid must be at least 1000"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

bidSchema.index({ auctionId: 1, amount: -1 });
bidSchema.index({ auctionId: 1, createdAt: -1 });
bidSchema.index({ userId: 1 });

bidSchema.statics.getHighestBid = function (auctionId) {
    return this.findOne({ auctionId }).sort({ amount: -1 });
};

export const Bid = mongoose.model("Bid", bidSchema);
