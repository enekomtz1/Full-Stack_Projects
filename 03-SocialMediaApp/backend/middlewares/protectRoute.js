import User from "../models/userModel";
import jwt from "jasonwebtoken";

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
