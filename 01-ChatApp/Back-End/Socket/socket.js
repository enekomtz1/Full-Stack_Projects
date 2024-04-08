/*
socket.js establishes the WebSocket communication for real-time chat functionality.
It sets up the socket.io server, manages connections, and handles user activities.
*/

import { Server } from "socket.io"; // Import Server from socket.io for WebSocket communication
import http from "http"; // Import http to create an HTTP server
import express from "express"; // Import express to create the app instance

const app = express(); // Initialize the express application

// Create an HTTP server instance using the express app
const server = http.createServer(app);

// Initialize a new socket.io server instance, configuring CORS to allow requests
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"], // Allowed origins for cross-origin requests
		methods: ["GET", "POST"], // Allowed HTTP methods for CORS
	},
});

// Function to get the socket ID of a receiver by their user ID
export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId]; // Return the socket ID from the user-socket mapping
};

// Object to map user IDs to their respective socket IDs
const userSocketMap = {}; // Format: { userId: socketId }

// Event listener for new socket connections
io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	// Retrieve userId from the socket handshake query
	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id; // Map the connected user's socket ID

	// Emit an event to update the list of online users
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Event listener for socket disconnection
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId]; // Remove the user from the map on disconnect
		io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update the list of online users
	});
});

// Export the app, io, and server instances for use in other parts of the application
export { app, io, server };
