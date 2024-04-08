/*
Mongoose schema and model for messages in the chat application.
*/

import mongoose from "mongoose"; // Import the mongoose library for MongoDB interaction

// Define the schema for a message
const messageSchema = new mongoose.Schema(
	{
		// Reference to the User model for the sender of the message
		senderId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing other documents
			ref: "User", // Reference to the User model
			required: true, // This field is mandatory
		},
		// Reference to the User model for the receiver of the message
		receiverId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing other documents
			ref: "User", // Reference to the User model
			required: true, // This field is mandatory
		},
		// The actual message content
		message: {
			type: String, // Data type is a string
			required: true, // This field is mandatory
		},
		// No need to manually define createdAt and updatedAt, they will be handled by timestamps
	},
	{ timestamps: true } // Enable automatic creation of createdAt and updatedAt fields
);

// Create the Message model based on the schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model for use elsewhere in the application
export default Message;
