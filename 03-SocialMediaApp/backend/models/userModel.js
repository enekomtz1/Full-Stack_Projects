/*
- This code defines a MongoDB schema for a User model using Mongoose.
- It includes fields for name, username, email, and password which are all required.
- The username and email fields are set as unique to prevent duplicate entries.
- Additional fields like profile picture, followers, following, bio, and account status are also defined.
- The schema utilizes timestamps to automatically add `createdAt` and `updatedAt` fields to each document.
*/

// Import mongoose to utilize its functionalities for MongoDB operations
import mongoose from "mongoose";

// Define a schema for the User model with specific fields and validations
const userSchema = mongoose.Schema(
	{
		// Name field, which is a required string
		name: {
			type: String,
			required: true,
		},

		// Username field, which is a required string and must be unique
		username: {
			type: String,
			required: true,
			unique: true,
		},

		// Email field, which is a required string and must be unique
		email: {
			type: String,
			required: true,
			unique: true,
		},

		// Password field, which is a required string with a minimum length of 6 characters
		password: {
			type: String,
			minLength: 6,
			required: true,
		},

		// Profile picture field, optional with a default empty string
		profilePic: {
			type: String,
			default: "",
		},

		// Followers field, an array of strings representing user IDs of followers, default is an empty array
		followers: {
			type: [String],
			default: [],
		},

		// Following field, an array of strings representing user IDs this user is following, default is an empty array
		following: {
			type: [String],
			default: [],
		},

		// Bio field, optional string for user biography, default is an empty string
		bio: {
			type: String,
			default: "",
		},

		// isFrozen field, a boolean representing if the user account is temporarily frozen, default is false
		isFrozen: {
			type: Boolean,
			default: false,
		},
	},
	{
		// Enable automatic handling of createdAt and updatedAt fields
		timestamps: true,
	}
);

// Compile the schema into a model which creates a collection named 'users' in MongoDB
const User = mongoose.model("User", userSchema);

// Export the User model to be used in other parts of the application
export default User;
