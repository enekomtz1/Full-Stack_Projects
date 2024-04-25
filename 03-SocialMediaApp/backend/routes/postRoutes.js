// Import the Express module to facilitate the creation of an HTTP server API.
import express from "express";

// Import various post-related controllers to handle specific API endpoint logic.
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts } from "../controllers/postController.js";

// Import middleware to protect routes that require authentication.
import protectRoute from "../middlewares/protectRoute.js";

// Create a new router object to manage route endpoints.
const router = express.Router();

// Route to get posts for the feed of a user, requires authentication.
router.get("/feed", protectRoute, getFeedPosts);

// Route to get a specific post by its ID.
router.get("/:id", getPost);

// Route to get all posts by a specific user, identified by their username.
router.get("/user/:username", getUserPosts);

// Route to create a new post, requires authentication.
router.post("/create", protectRoute, createPost);

// Route to delete a specific post by its ID, requires authentication.
router.delete("/:id", protectRoute, deletePost);

// Route to like or unlike a post by its ID, requires authentication.
router.put("/like/:id", protectRoute, likeUnlikePost);

// Route to reply to a specific post by its ID, requires authentication.
router.put("/reply/:id", protectRoute, replyToPost);

// Export the router to be mounted by the main application.
export default router;
