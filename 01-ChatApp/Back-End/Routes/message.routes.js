/*
Routing for message-related operations in your chat application.
*/

import express from "express"; // Import Express to create the router
import { sendMessage, getMessage } from "../controllers/message.controller.js"; // Import the message controller functions
import protectRoute from "../middleware/protectRoute.js"; // Import the middleware to protect routes

const router = express.Router(); // Create a new router instance for message routes

// Define a GET route to retrieve messages in a conversation
// This route is protected, meaning the user must be authenticated to access it
router.get("/:id", protectRoute, getMessage);

// Define a POST route to send a new message in a conversation
// This route is also protected, requiring user authentication
router.post("/send/:id", protectRoute, sendMessage);

export default router; // Export the router for use in the main server file
