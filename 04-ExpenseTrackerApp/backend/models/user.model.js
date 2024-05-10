/*
- This code defines a Mongoose schema for a User model in a MongoDB database.
- It specifies various fields like username, name, password, profilePicture, and gender.
- Each field is defined with specific data types and constraints, such as 'required' and 'unique'.
- The 'profilePicture' field has a default value of an empty string if not provided.
- Timestamps are automatically added to each document, recording creation and update times.
*/

import mongoose from "mongoose"; // Import Mongoose to interact with MongoDB.

// Define the schema for the User model with specific attributes and constraints.
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String, // Data type of the username is string.
			required: true, // This field is mandatory.
			unique: true, // Username must be unique across all User documents.
		},
		name: {
			type: String, // Data type for the name field.
			required: true, // This field is also mandatory.
		},
		password: {
			type: String, // Data type for the password.
			required: true, // This field is required for security reasons.
		},
		profilePicture: {
			type: String, // Data type for the profile picture.
			default: "", // Default value for the profile picture is an empty string.
		},
		gender: {
			type: String, // Data type for gender.
			enum: ["male", "female"], // Restricts the value to 'male' or 'female'.
		},
	},
	{ timestamps: true } // Automatically manage createdAt and updatedAt timestamps.
);

// Create a model based on the schema.
const User = mongoose.model("User", userSchema);

export default User; // Export the User model for use elsewhere in the project.
