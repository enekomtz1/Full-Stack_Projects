/*
- This code is designed for a web application using GraphQL to manage user accounts.
- It implements operations like user registration, login, and logout, and includes queries for user details.
- The signUp mutation ensures user details are complete, checks for uniqueness, hashes the password, and assigns a gender-specific profile picture.
- The login mutation authenticates users and establishes a session, while the logout mutation clears the session and cookies.
- The user and authUser queries retrieve specific user data, and the transactions resolver fetches financial transactions for the user.
*/

import Transaction from "../models/transaction.model.js"; // Import the Transaction model from the model directory.
import User from "../models/user.model.js"; // Import the User model for accessing user data.
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing.

// Main object containing GraphQL resolvers related to user operations.
const userResolver = {
	Mutation: {
		// signUp mutation to register a new user in the database.
		signUp: async (_, { input }, context) => {
			try {
				// Extract necessary fields from input object.
				const { username, name, password, gender } = input;

				// Check if all required fields are provided.
				if (!username || !name || !password || !gender) {
					throw new Error("All fields are required");
				}

				// Check the database for an existing user with the same username.
				const existingUser = await User.findOne({ username });
				if (existingUser) {
					throw new Error("User already exists");
				}

				// Generate a salt for password hashing to enhance security.
				const salt = await bcrypt.genSalt(10);
				// Hash the password with the generated salt.
				const hashedPassword = await bcrypt.hash(password, salt);

				// Define URLs for profile pictures based on the gender.
				const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
				const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

				// Create a new user object with the hashed password and other details.
				const newUser = new User({
					username,
					name,
					password: hashedPassword,
					gender,
					profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
				});

				// Save the new user to the database.
				await newUser.save();

				// Log in the new user automatically after registration.
				await context.login(newUser);
				return newUser;
			} catch (err) {
				// Log and rethrow any errors encountered during the signup process.
				console.error("Error in signUp: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},

		// login mutation to authenticate a user and start a session.
		login: async (_, { input }, context) => {
			try {
				// Check if username and password are provided.
				const { username, password } = input;
				if (!username || !password) throw new Error("All fields are required");

				// Use context's authenticate method to validate user credentials.
				const { user } = await context.authenticate("graphql-local", { username, password });

				// Log in the user if authentication is successful.
				await context.login(user);
				return user;
			} catch (err) {
				// Handle and log any errors during the login process.
				console.error("Error in login:", err);
				throw new Error(err.message || "Internal server error");
			}
		},

		// logout mutation to end a user's session and clear session data.
		logout: async (_, __, context) => {
			try {
				// Perform logout by ending the session.
				await context.logout();

				// Destroy the session and handle any errors.
				context.req.session.destroy((err) => {
					if (err) throw err;
				});

				// Clear session cookie to ensure user is fully logged out.
				context.res.clearCookie("connect.sid");

				// Return a success message post-logout.
				return { message: "Logged out successfully" };
			} catch (err) {
				// Log and handle any errors encountered during logout.
				console.error("Error in logout:", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
	Query: {
		// authUser query to fetch the currently authenticated user's data.
		authUser: async (_, __, context) => {
			try {
				// Retrieve the authenticated user's details.
				const user = await context.getUser();
				return user;
			} catch (err) {
				// Handle and log any errors when fetching authenticated user's data.
				console.error("Error in authUser: ", err);
				throw new Error("Internal server error");
			}
		},

		// user query to retrieve a specific user by their ID.
		user: async (_, { userId }) => {
			try {
				// Fetch user data based on the provided user ID.
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				// Handle and log errors in fetching user data by ID.
				console.error("Error in user query:", err);
				throw new Error(err.message || "Error getting user");
			}
		},
	},
	User: {
		// transactions resolver to fetch transactions related to a user.
		transactions: async (parent) => {
			try {
				// Retrieve transactions for the user identified by parent._id.
				const transactions = await Transaction.find({ userId: parent._id });
				return transactions;
			} catch (err) {
				// Handle and log any errors encountered while fetching transactions.
				console.log("Error in user.transactions resolver: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
};

// Export the userResolver to make it available for GraphQL operations elsewhere in the application.
export default userResolver;

