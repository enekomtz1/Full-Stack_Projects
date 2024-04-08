/*
Routing for user-related operations in the chat application.
This includes fetching a list of users for the sidebar, which is only accessible to authenticated users.
*/

import express from "express"; // Import the express library to facilitate routing
import protectRoute from "../Middleware/protectRoute.js"; // Middleware to ensure routes are protected and accessible only by authenticated users
import { getUsersForSidebar } from "../Controllers/user.controller.js"; // Controller function to get user data for the sidebar

const router = express.Router(); // Initialize a new express router to define route endpoints

// Define a GET route that retrieves a list of users for the sidebar in the chat application
// This route is protected, meaning only authenticated users can access it
router.get("/", protectRoute, getUsersForSidebar);

export default router; // Export the router to make it accessible to the rest of the application
