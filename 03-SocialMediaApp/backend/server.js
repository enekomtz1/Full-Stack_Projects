/*
- This code sets up a server using Express.js to handle requests and responses for a web application.
- It imports necessary modules like path, express, dotenv for environment configurations, and various custom modules like database connections and route handlers.
- The dotenv.config() call loads environment variables which are used to configure things like database connections and cloud services.
- It initializes a MongoDB connection and a scheduled job, and configures middleware for processing requests.
- The server is configured to serve a React application in production and to listen on a dynamically assigned port.
*/

import path from "path"; // Import the path module to handle and transform file paths
import express from "express"; // Import the express framework to facilitate the server creation
import dotenv from "dotenv"; // Import the dotenv module to load environment variables from .env file
import connectDB from "./db/connectDB.js"; // Import the database connection function
import cookieParser from "cookie-parser"; // Import the cookie-parser middleware to parse cookies attached to the client request object
import userRoutes from "./routes/userRoutes.js"; // Import routes for user-related endpoints
import postRoutes from "./routes/postRoutes.js"; // Import routes for post-related endpoints
import messageRoutes from "./routes/messageRoutes.js"; // Import routes for message-related endpoints
import { v2 as cloudinary } from "cloudinary"; // Import the cloudinary module to handle image uploads
import { app, server } from "./socket/socket.js"; // Import app and server objects from the socket configuration file
import job from "./cron/cron.js"; // Import the scheduled job configuration

dotenv.config(); // Load environment variables from .env file into process.env

connectDB(); // Connect to the MongoDB database
job.start(); // Start the scheduled job for recurring tasks

const PORT = process.env.PORT || 5000; // Set the server port using environment variable or default to 5000
const __dirname = path.resolve(); // Resolve the current directory path

// Configure cloudinary with environment variable settings
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" })); // Use express.json middleware to parse JSON payloads larger than 50mb
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded middleware to parse URL-encoded data with rich objects and arrays
app.use(cookieParser()); // Use cookieParser middleware to parse the cookies attached to the client request object

// Routes
app.use("/api/users", userRoutes); // Mount userRoutes under the /api/users path
app.use("/api/posts", postRoutes); // Mount postRoutes under the /api/posts path
app.use("/api/messages", messageRoutes); // Mount messageRoutes under the /api/messages path

// Serve static files in production mode
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Serve static files located in the dist directory

	// Serve the main index.html of the React app for any unknown paths
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Start the server and log the URL at which it's listening
server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
