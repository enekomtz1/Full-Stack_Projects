/*
- This code defines a function to generate a JSON Web Token (JWT) and set it in a cookie.
- It takes two parameters: userId and res, where res is expected to be an HTTP response object.
- The JWT is signed using a secret key from the environment variables and is set to expire in 15 days.
- The function sets the JWT as an httpOnly cookie on the response object to enhance security.
- It returns the generated JWT so that it can be used elsewhere in the application if needed.
*/

import jwt from "jsonwebtoken";

// Define a function to generate a token and set it as an HTTP-only cookie
const generateTokenAndSetCookie = (userId, res) => {
	// Sign a new JWT for the given user ID with an expiration of 15 days
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	// Set the JWT as a cookie on the response object with security options
	res.cookie("jwt", token, {
		httpOnly: true, // Enhances security by making the cookie inaccessible to client-side scripts
		maxAge: 15 * 24 * 60 * 60 * 1000, // Sets the cookie to expire in 15 days, converted to milliseconds
		sameSite: "strict", // Prevents the browser from sending this cookie along with cross-site requests
	});

	// Return the generated JWT
	return token;
};

// Export the function to make it available for use elsewhere in the application
export default generateTokenAndSetCookie;
