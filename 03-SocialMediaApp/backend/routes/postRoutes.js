/*
- This code initializes and configures routes for a social media application's server.
- It imports necessary functions from the post controller which manage CRUD operations for posts.
- Middlewares are utilized to protect routes that require user authentication.
- The router is set up to handle various endpoints related to posts, such as fetching, creating, and modifying posts.
- It ensures that only authenticated users can access certain sensitive routes like creating or deleting posts.
*/

// Import the Express framework to facilitate routing
import express from "express";

// Import specific controller functions that manage post interactions
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts } from "../controllers/postController.js";

// Import middleware to protect routes that require user authentication
import protectRoute from "../middlewares/protectRoute.js";

// Create a new router object from Express to define API routes
const router = express.Router();

// Define a route to get all posts for the feed, protected by authentication
router.get("/feed", protectRoute, getFeedPosts);

// Define a route to get a single post by ID, no authentication required
router.get("/:id", getPost);

// Define a route to get all posts by a specific user, no authentication required
router.get("/user/:username", getUserPosts);

// Define a route to create a new post, protected by authentication
router.post("/create", protectRoute, createPost);

// Define a route to delete a post by ID, protected by authentication
router.delete("/:id", protectRoute, deletePost);

// Define a route to toggle the like status of a post, protected by authentication
router.put("/like/:id", protectRoute, likeUnlikePost);

// Define a route to reply to a post, also protected by authentication
router.put("/reply/:id", protectRoute, replyToPost);

// Export the configured router
export default router;
