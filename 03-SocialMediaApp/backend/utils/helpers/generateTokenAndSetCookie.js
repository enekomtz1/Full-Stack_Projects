// Import the jsonwebtoken package
import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for the given user and sets it in an HTTP cookie.
 * @param {string} userId - The user's ID to encode in the JWT.
 * @param {Object} res - The response object to set the cookie on.
 * @returns {string} - The generated JWT.
 */
const generateTokenAndSetCookie = (userId, res) => {
	// Create a JWT, encoding the user's ID and using a secret from environment variables
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d", // Set the token to expire in 15 days
	});

	// Set the JWT as an HTTP-only cookie on the response object
	res.cookie("jwt", token, {
		httpOnly: true, // HTTP-only means the cookie is not accessible via JavaScript (more secure)
		maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (15 days)
		sameSite: "strict", // SameSite=strict helps protect against CSRF attacks
	});

	// Return the generated token
	return token;
};

// Export the function to be used in other parts of the application
export default generateTokenAndSetCookie;
