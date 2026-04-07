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
