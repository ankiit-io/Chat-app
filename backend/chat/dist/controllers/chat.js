import axios from "axios";
import tryCatch from "../config/tryCatch.js";
import Chat from "../models/chat.js";
import { Messages } from "../models/message.js";
export const createChat = tryCatch(async (req, res) => {
    const userId = req.user;
    const { otherUserId } = req.body;
    if (!otherUserId) {
        res.status(400).json({ message: "other userid is required" });
        return;
    }
    const existingchat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 }
    });
    if (existingchat) {
        res.json({
            message: "Chat already exists",
            chatId: existingchat._id
        });
        return;
    }
    const newChat = await Chat.create({
        users: [userId, otherUserId]
    });
    res.status(201).json({
        message: "New Chat created successfully",
        chatId: newChat._id
    });
});
export const getAllChats = tryCatch(async (req, res) => {
    const userId = req.user;
    if (!userId) {
        res.status(400).json({ message: "User id missing" });
        return;
    }
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatsWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
        const unseenCount = await Messages.countDocuments({
            chatId: chat._id,
            seen: false,
            sender: { $ne: userId }
        });
        try {
            const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/users/${otherUserId}`);
            return {
                user: data,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestmessage || null,
                    unseenCount,
                },
            };
        }
        catch (error) {
            console.log(error);
            return {
                user: { _id: otherUserId, name: "Unknown User" },
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestmessage || null,
                    unseenCount,
                },
            };
        }
    }));
    res.json({
        chats: chatsWithUserData
    });
});
export const sendMessage = tryCatch(async (req, res) => {
    const senderId = req.user;
    const { chatId, text } = req.body;
    consst;
    imageFile = req.file;
});
//# sourceMappingURL=chat.js.map