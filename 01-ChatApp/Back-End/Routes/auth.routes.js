/*
Routing for authentication-related operations in the application.
*/

import express from "express"; // Import the express library to use its routing functionality
import { signup, login, logout } from "../Controllers/auth.controller.js"; // Import the authentication controller functions

const router = express.Router(); // Create a new router object to define route handlers

// Define a POST route for user signup that uses the signup function from the authentication controller
router.post("/signup", signup);

// Define a POST route for user login that uses the login function from the authentication controller
router.post("/login", login);

// Define a POST route for user logout that uses the logout function from the authentication controller
router.post("/logout", logout);

export default router; // Export the router for use in the main server file
