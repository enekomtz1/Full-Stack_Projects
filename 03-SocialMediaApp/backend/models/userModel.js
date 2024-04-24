import mongoose from "mongoose";

// Define a schema for user profiles in an application using Mongoose
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true, // The name field is mandatory
		},
		username: {
			type: String,
			required: true, // The username field is mandatory
			unique: true, // The username must be unique across all users
		},
		email: {
			type: String,
			required: true, // The email field is mandatory
			unique: true, // The email must be unique across all users
		},
		password: {
			type: String,
			minLength: 6, // The minimum length for the password is 6 characters
			required: true, // The password field is mandatory
		},
		profilePic: {
			type: String,
			default: "", // Default value for the profile picture is an empty string
		},
		followers: {
			type: [String], // An array of user IDs representing followers of this user
			default: [], // Default is an empty array
		},
		following: {
			type: [String], // An array of user IDs that this user is following
			default: [], // Default is an empty array
		},
		bio: {
			type: String,
			default: "", // Default value for bio is an empty string
		},
		isFrozen: {
			type: Boolean,
			default: false, // Indicates whether the user's account is frozen; default is not frozen
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt timestamps for the user document
	}
);

// Create the User model using the defined schema
const User = mongoose.model("User", userSchema);

// Export the User model so it can be used elsewhere in the application
export default User;
