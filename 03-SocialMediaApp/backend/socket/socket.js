// Import necessary libraries and modules
import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

// Initialize the Express application
const app = express();

// Create an HTTP server based on the Express app
const server = http.createServer(app);

// Initialize a new WebSocket server using the Socket.io library with CORS settings
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000", // Allowed CORS origin
		methods: ["GET", "POST"], // Allowed HTTP methods
	},
});

// Function to retrieve a user's socket ID using their user ID
export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

// Object to store user IDs and their corresponding socket IDs
const userSocketMap = {}; // userId: socketId

// Handle a new connection event on the WebSocket server
io.on("connection", (socket) => {
	console.log("user connected", socket.id);
	const userId = socket.handshake.query.userId;

	// If a user ID is present, map it to the socket ID
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// Emit an event to all clients with the list of online users
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Handle the event for marking messages as seen in a conversation
	socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
		try {
			// Update all unseen messages in a conversation to seen
			await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });

			// Update the conversation's last message to seen
			await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });

			// Notify the specific user that the messages have been seen
			io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
		} catch (error) {
			console.log(error);
		}
	});

	// Handle user disconnection
	socket.on("disconnect", () => {
		console.log("user disconnected");
		delete userSocketMap[userId]; // Remove the user from the map

		// Notify all clients about the updated list of online users
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

// Export variables for use in other modules
export { io, server, app };
