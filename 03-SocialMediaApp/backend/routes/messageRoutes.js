/*
- This code sets up routing for a messaging application using the Express framework.
- It imports necessary functions and middleware, including route protection and message controllers.
- Routes are defined to handle retrieving conversations, fetching messages, and sending new messages.
- Each route is secured with an authorization middleware to ensure that only authenticated users can access these endpoints.
- The router is then exported for integration with the main application server.
*/

// Import the Express framework, route protection middleware, and message controller functions.
import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

// Create a new router instance to define and manage routes.
const router = express.Router();

// Define a GET route to fetch all conversation metadata, secured with the protectRoute middleware.
router.get("/conversations", protectRoute, getConversations);

// Define a GET route to retrieve messages from a specific user by their ID, also secured by the protectRoute middleware.
router.get("/:otherUserId", protectRoute, getMessages);

// Define a POST route to allow the sending of a new message, ensuring the user is authenticated with the protectRoute middleware.
router.post("/", protectRoute, sendMessage);

// Export the router module for use in the main server setup, making these routes accessible.
export default router;
