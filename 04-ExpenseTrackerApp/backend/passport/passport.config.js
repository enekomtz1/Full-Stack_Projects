/*
- This code configures Passport.js authentication strategies for a GraphQL server.
- It includes serialization and deserialization methods to manage user sessions.
- A custom local strategy is used to authenticate users based on username and password.
- Error handling is integrated to manage incorrect username or password inputs securely.
- Bcrypt.js is utilized to safely compare hashed passwords.
*/

import passport from "passport"; // Import passport for authentication handling
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing and verification

import User from "../models/user.model.js"; // Import the User model from the models directory
import { GraphQLLocalStrategy } from "graphql-passport"; // Import GraphQLLocalStrategy for passport authentication in GraphQL

export const configurePassport = async () => {
	// Define an asynchronous function to configure passport
	// Serialize user function to store a user ID in the session
	passport.serializeUser((user, done) => {
		console.log("Serializing user"); // Log serializing process
		done(null, user.id); // Pass user ID to done function to store in session
	});

	// Deserialize user function to retrieve user data from the session by user ID
	passport.deserializeUser(async (id, done) => {
		console.log("Deserializing user"); // Log deserializing process
		try {
			const user = await User.findById(id); // Retrieve user from the database by ID
			done(null, user); // Pass retrieved user to done function
		} catch (err) {
			done(err); // Handle errors during deserialization
		}
	});

	// Use a custom local strategy for authenticating with a username and password
	passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username }); // Find user by username
				if (!user) {
					throw new Error("Invalid username or password"); // Throw error if user not found
				}
				const validPassword = await bcrypt.compare(password, user.password); // Compare provided password with stored hash

				if (!validPassword) {
					throw new Error("Invalid username or password"); // Throw error if password does not match
				}

				return done(null, user); // Authenticate the user
			} catch (err) {
				return done(err); // Handle errors during authentication
			}
		})
	);
};
