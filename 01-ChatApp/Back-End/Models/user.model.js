/*
Mongoose schema and model for users in the chat application.
*/

import mongoose from "mongoose"; // Import mongoose for schema definition and model creation

// Define the schema for the user model
const userSchema = new mongoose.Schema(
	{
		// Full name of the user
		fullName: {
			type: String, // Data type is a string
			required: true, // This field is mandatory
		},
		// Username for the user, must be unique
		username: {
			type: String, // Data type is a string
			required: true, // This field is mandatory
			unique: true, // Ensures that each username is unique in the database
		},
		// Password for the user account
		password: {
			type: String, // Data type is a string
			required: true, // This field is mandatory
			minlength: 6, // Sets a minimum length requirement for the password
		},
		// Gender of the user, can only be 'male' or 'female'
		gender: {
			type: String, // Data type is a string
			required: true, // This field is mandatory
			enum: ["male", "female"], // Enumerates the allowed values for this field
		},
		// URL to the user's profile picture
		profilePic: {
			type: String, // Data type is a string
			default: "", // Default value for the profile picture field
		},
		// No need to manually define createdAt and updatedAt, they will be handled by timestamps
	},
	{ timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model for use elsewhere in the application
export default User;
