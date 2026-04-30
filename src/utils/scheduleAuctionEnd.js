import { Auction } from "../models/auction.model.js";
import { auctionQueue } from "../queues/auction.queues.js";

export const scheduleAuctionEnd = async (auctionId, countdownEnd) => {
    const delay = new Date(countdownEnd).getTime() - Date.now();

    if (delay <= 0) return;

    await auctionQueue.remove(auctionId.toString()).catch(() => {});
    console.log("Delay to end:", delay);
    await auctionQueue.add(
        "endAuction",
        { auctionId },
        {
            delay,
            jobId: auctionId.toString(),
        }
    );
    console.log("scheduler called successfully");
};

export const scheduleAuctionStart = async (auctionId, startTime) => {
    const delay = new Date(startTime).getTime() - Date.now();

    if (delay <= 0) return;

    await auctionQueue.remove(auctionId.toString() + "_start").catch(() => {});

    await auctionQueue.add(
        "startAuction",
        { auctionId },
        {
            delay,
            jobId: auctionId.toString() + "_start",
            removeOnComplete: true,
        }
    );

    console.log("Start scheduler called");
};

export const rehydrateAuctionStartJobs = async () => {
    console.log("Rehydrating START jobs...");

    const now = Date.now();

    const auctions = await Auction.find({
        status: "draft",
    }).select("_id startTime");

    for (const auction of auctions) {
        const auctionId = auction._id.toString();

        const delay = new Date(auction.startTime).getTime() - now;

        if (delay <= 0) {
            // missed start → trigger immediately
            await auctionQueue.add(
                "startAuction",
                { auctionId },
                {
                    jobId: auctionId + "_start",
                    removeOnComplete: true,
                }
            );
            continue;
        }

        await auctionQueue.add(
            "startAuction",
            { auctionId },
            {
                delay,
                jobId: auctionId + "_start",
                removeOnComplete: true,
            }
        );
    }

    console.log(`Rehydrated ${auctions.length} start jobs`);
};

export const rehydrateAuctionEndJobs = async () => {
    console.log("Rehydrating END jobs...");

    const now = Date.now();

    const auctions = await Auction.find({
        status: { $in: ["active"] },
    }).select("_id countdownEnd endTime status auctionType");

    for (const auction of auctions) {
        let endTiming;

        if (auction.auctionType === "short") {
            endTiming = auction?.countdownEnd || null;
        } else {
            endTiming = auction.endTime;
        }

        if (!endTiming) continue;

        const delay = new Date(endTiming).getTime() - now;

        if (isNaN(delay)) continue;

        if (delay <= 0) {
            // auction already expired
            await auctionQueue.add(
                "endAuction",
                { auctionId: auction._id },
                {
                    jobId: auction._id.toString(),
                    removeOnComplete: true,
                }
            );
            continue;
        }

        await auctionQueue.add(
            "endAuction",
            { auctionId: auction._id },
            {
                delay,
                jobId: auction._id.toString(),
                removeOnComplete: true,
            }
        );
    }

    console.log(`Rehydrated ${auctions.length} END jobs`);
};
