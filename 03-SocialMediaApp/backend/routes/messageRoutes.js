// Import Express framework and necessary functions and middleware
import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

// Create a new router object to handle routes
const router = express.Router();

// Route to get all conversations. Requires authorization via protectRoute.
router.get("/conversations", protectRoute, getConversations);

// Route to get messages with a specific user by their ID. Requires authorization.
router.get("/:otherUserId", protectRoute, getMessages);

// Route to send a new message. Requires user to be authorized.
router.post("/", protectRoute, sendMessage);

// Export the router to be mounted by the main application.
export default router;
