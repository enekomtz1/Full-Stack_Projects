/*
- This code implements a middleware function for Express.js to protect routes.
- It checks for a JSON Web Token (JWT) in the request cookies to authenticate users.
- Unauthorized access is prevented if no valid JWT is found.
- Upon successful verification of the JWT, the corresponding user details are fetched from the database.
- The user's information, excluding their password, is attached to the request object for use in subsequent middleware or routes.
*/

// Import the User model to interact with the MongoDB users collection
import User from "../models/userModel";

// Import JSON Web Token to handle JWT operations
import jwt from "jsonwebtoken";

// If the user is not logged in or hasn't an account, he/she won't be able to access the app.
// Middleware to protect routes and ensure user is authenticated
const protectRoute = async (req, res, next) => {
	try {
		// Retrieve the JWT from the request cookies
		const token = req.cookies.jwt;

		// If no token is found, return an Unauthorized error
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		// Decode and verify the JWT using the secret from environment variables
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Find the user associated with the decoded JWT and exclude their password from the result
		const user = await User.findById(decoded.userId).select("-password");

		// Attach the user object to the request for use in subsequent middleware or routing
		req.user = user;

		// Proceed to the next middleware or route handler
		next();
	} catch (err) {
		// If an error occurs, return a server error message and log it
		res.status(500).json({ message: err.message });
		console.log("Error in protectRoute: ", err.message);
	}
};

export default protectRoute;
