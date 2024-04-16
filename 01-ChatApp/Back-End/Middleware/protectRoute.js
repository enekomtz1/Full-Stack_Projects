/*
Middleware function that protects routes.
It ensures that the request is authenticated using a JSON Web Token (JWT).
*/

import jwt from "jsonwebtoken"; // Import JWT to handle token operations
import User from "../models/user.model.js"; // Import the user model to access user data

// Middleware function to protect routes
const protectRoute = async (req, res, next) => {
	try {
		// Extract the token from cookies
		const token = req.cookies.jwt;

		// If no token is found, return an unauthorized error
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		// Verify the token with the secret key and decode it
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// If token verification fails, return an unauthorized error
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		// Find the user by ID decoded from the token, excluding the password field
		const user = await User.findById(decoded.userId).select("-password");

		// If no user is found with the given ID, return a not found error
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach the user object to the request for downstream use in the route handler
		req.user = user;

		// Call next to pass control to the next middleware or route handler
		next();
	} catch (error) {
		// Log any errors and return an internal server error response
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Export the protectRoute middleware for use in the application
export default protectRoute;
