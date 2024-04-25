// Import the Express module to facilitate the creation of an HTTP server API.
import express from "express";

// Import user-related controller functions from the userController module
import { followUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser, getSuggestedUsers, freezeAccount } from "../controllers/userController.js";

// Import middleware to protect routes that require authentication.
import protectRoute from "../middlewares/protectRoute.js";

// Create a new router object to manage route endpoints.
const router = express.Router();

// Route to get a user profile by a query parameter, no authentication required
router.get("/profile/:query", getUserProfile);

// Route to get suggested users, requires user to be authenticated
router.get("/suggested", protectRoute, getSuggestedUsers);

// Route for user signup, no authentication required
router.post("/signup", signupUser);

// Route for user login, no authentication required
router.post("/login", loginUser);

// Route for user logout, no authentication required
router.post("/logout", logoutUser);

// Route to follow or unfollow a user, requires user to be authenticated
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state (follow/unfollow)

// Route to update user details, requires user to be authenticated
router.put("/update/:id", protectRoute, updateUser);

// Route to freeze a user account, requires user to be authenticated
router.put("/freeze", protectRoute, freezeAccount);

// Export the router to be mounted by the main application.
export default router;
