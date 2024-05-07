/*
- This code sets up routing for a messaging service using the Express.js framework.
- It imports necessary middleware and controller functions from external files.
- The 'protectRoute' middleware is applied to each route to ensure that only authenticated users can access them.
- Routes are defined to handle fetching conversations, individual messages, and sending messages.
- The router is then exported for use in the main application, allowing these routes to be attached to an Express app.
*/

// Import the express module to create router handlers.
import express from "express";

// Import middleware to protect routes by ensuring user authentication.
import protectRoute from "../middlewares/protectRoute.js";

// Import controller functions to handle the logic for message operations.
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

// Create a new router object to handle route requests.
const router = express.Router();

// Define a GET route to retrieve all conversations for the authenticated user.
router.get("/conversations", protectRoute, getConversations);

// Define a GET route to retrieve messages with a specific user, identified by 'otherUserId'.
router.get("/:otherUserId", protectRoute, getMessages);

// Define a POST route to send a new message.
router.post("/", protectRoute, sendMessage);

// Export the router for use in the main server setup.
export default router;
