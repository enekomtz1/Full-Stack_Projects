// Package imports:
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes import
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/message.routes.js";
import userRoutes from "./Routes/user.routes.js";

// DataBase import
import connectToMongoDB from "./DataBase/connectToMongoDB.js";
import { app, server } from "./Socket/socket.js"; // Import express app and server from socket configuration

dotenv.config(); // Load environment variables from .env file into process.env

const __dirname = path.resolve(); // Set the current directory path

const PORT = process.env.PORT || 5000; // Define the port number to be used by the server

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// Route middlewares
app.use("/api/auth", authRoutes); // Routes for authentication
app.use("/api/messages", messageRoutes); // Routes for message handling
app.use("/api/users", userRoutes); // Routes for user management

// Serve static files from the Front-End distribution directory
app.use(express.static(path.join(__dirname, "/Front-End/dist")));

// Catch-all route to serve the front-end application
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "Front-End", "dist", "index.html"));
});

// Start the server and connect to MongoDB
server.listen(PORT, () => {
	connectToMongoDB(); // Connect to MongoDB when the server starts
	console.log(`Server running on port ${PORT}`); // Log the server start event
});
