export const customerSupportChat = (message) => {
    const msg = message.toLowerCase();

    // 🔥 bidding
    if (msg.includes("bid")) {
        return "To place a bid, enter an amount higher than the current highest bid and confirm.";
    }

    // 🔥 payment
    if (msg.includes("payment") || msg.includes("pay")) {
        return "Payments are processed securely via Razorpay. Please ensure sufficient balance.";
    }

    // 🔥 refund
    if (msg.includes("refund")) {
        return "Refunds are processed within 3–5 business days after cancellation.";
    }

    // 🔥 login issues
    if (msg.includes("login") || msg.includes("password")) {
        return "If you're having login issues, try resetting your password or contact support.";
    }

    // 🔥 auction rules
    if (msg.includes("auction")) {
        return "In an auction, the highest bidder at the end time wins the item.";
    }

    // 🔥 fallback
    return "Sorry, I didn't understand. Please contact support or rephrase your question.";
};
