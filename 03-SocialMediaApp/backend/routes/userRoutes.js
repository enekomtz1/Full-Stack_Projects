/*
- This code initializes a router for handling user-related requests in a web application.
- It imports necessary functions from the 'userController' and middleware for route protection.
- Each route is associated with a specific user function such as signing up, logging in, and getting user profiles.
- Protected routes require the user to be authenticated before they can access the functionality.
- The router is then exported for use in other parts of the application, ensuring modularity and ease of management.
*/

// Import the express module to handle HTTP requests
import express from "express";

// Import user-related controllers to handle specific functionalities
import { followUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser, getSuggestedUsers, freezeAccount } from "../controllers/userController.js";

// Import middleware to protect routes that require authentication
import protectRoute from "../middlewares/protectRoute.js";

// Create a router object from express to manage our routes
const router = express.Router();

// Define a route to get a user's profile based on a query parameter
router.get("/profile/:query", getUserProfile);

// Define a route to get suggested users, protected so only authenticated users can access it
router.get("/suggested", protectRoute, getSuggestedUsers);

// Define a route for users to sign up
router.post("/signup", signupUser);

// Define a route for users to log in
router.post("/login", loginUser);

// Define a route for users to log out
router.post("/logout", logoutUser);

// Define a route to follow or unfollow another user, requires authentication
router.post("/follow/:id", protectRoute, followUnFollowUser);

// Define a route to update user information, protected to ensure only authenticated users can modify their data
router.put("/update/:id", protectRoute, updateUser);

// Define a route to freeze a user account, protected to ensure only authenticated staff can perform this action
router.put("/freeze", protectRoute, freezeAccount);

// Export the configured router to be used in other parts of the application
export default router;
