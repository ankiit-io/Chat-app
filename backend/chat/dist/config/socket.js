import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const userSocketMap = {};
export const getRecieverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
    }
    io.emit("getOnlineUser", Object.keys(userSocketMap));
    if (userId) {
        socket.join(userId);
    }
    socket.on("typing", (data) => {
        console.log(`User ${data.userId} is typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userTyping", {
            chatId: data.chatId,
            userId: data.userId
        });
    });
    socket.on("stopTyping", (data) => {
        console.log(`User ${data.userId} stopped typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userStoppedTyping", {
            chatId: data.chatId,
            userId: data.userId
        });
    });
    socket.on("joinChat", (chatId) => {
        console.log(`User ${userId} joined chat room ${chatId}`);
        socket.join(chatId);
    });
    socket.on("leaveChat", (chatId) => {
        console.log(`User ${userId} left chat room ${chatId}`);
        socket.leave(chatId);
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        if (userId && userId !== "undefined") {
            delete userSocketMap[userId];
            console.log(`User ${userId} disconnected and removed from online users`);
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });
    socket.on("connect_error", (error) => {
        console.error("Socket Connection error:", error);
    });
});
export { app, server, io };
//# sourceMappingURL=socket.js.map