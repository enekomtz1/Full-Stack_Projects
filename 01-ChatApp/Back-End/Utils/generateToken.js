/*
generateToken.js is responsible for generating a JWT (JSON Web Token) for authenticated users
and setting this token as a cookie in the user's browser for session management.
*/

import jwt from "jsonwebtoken"; // Import jwt to create JSON Web Tokens

// Function to generate a token and set it as a cookie in the response
const generateTokenAndSetCookie = (userId, res) => {
	// Generate a JWT token with the user's ID and a secret key, set to expire in 15 days
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d", // Token expiration set to 15 days
	});

	// Set the generated token as a cookie in the response
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // Set cookie to expire in 15 days, in milliseconds
		httpOnly: true, // Cookie is only accessible by the web server, preventing XSS attacks
		sameSite: "strict", // Prevents the browser from sending this cookie along with cross-site requests, mitigating CSRF attacks
		secure: process.env.NODE_ENV !== "development", // Cookie will only be sent over HTTPS, except in development mode
	});
};

export default generateTokenAndSetCookie;
