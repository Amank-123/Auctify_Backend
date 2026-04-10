// controllers/chat.controller.js
import { customerSupportChat } from "../utils/chatService.js";

export const chatHandler = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required",
        });
    }

    const reply = customerSupportChat(message);

    res.json({
        success: true,
        reply,
    });
};
