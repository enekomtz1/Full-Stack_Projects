/*
- This code sets up a real-time messaging server using Express, HTTP, and Socket.IO.
- It allows bidirectional communication between clients and server over WebSockets.
- The server listens for connections, message status updates, and disconnections.
- Messages and conversation statuses are updated in a MongoDB database using Mongoose models.
- The code manages online users by mapping user IDs to their socket IDs and emits updates accordingly.
*/

import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

// Initialize Express application
const app = express();

// Create an HTTP server with the Express app
const server = http.createServer(app);

// Set up the Socket.IO server with CORS policy
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

// Map to keep track of user IDs and their corresponding socket IDs
const userSocketMap = {};

// Socket.IO event listener for new connections
io.on("connection", (socket) => {
	console.log("user connected", socket.id);

	// Retrieve user ID from the connection handshake query
	const userId = socket.handshake.query.userId;

	// Store socket ID associated with the user ID if defined
	if (userId !== "undefined") userSocketMap[userId] = socket.id;

	// Broadcast updated list of online users
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Listen for requests to mark messages as seen in a conversation
	socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
		try {
			// Update all unseen messages in the conversation to seen
			await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });

			// Update the last message in the conversation as seen
			await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });

			// Notify the user that messages have been marked as seen
			io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
		} catch (error) {
			console.log(error);
		}
	});

	// Handle user disconnection
	socket.on("disconnect", () => {
		console.log("user disconnected");
		// Remove the user from the socket map

		delete userSocketMap[userId];
		// Broadcast updated list of online users
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

// Function to get the socket ID for a given recipient's user ID
export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

// Exporting key components for use elsewhere in the application
export { io, server, app };
