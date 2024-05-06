/*
- This code defines a schema for messages in a chat application using the Mongoose library.
- It establishes relationships with other collections, such as 'Conversation' and 'User'.
- The schema includes fields for the conversation ID, sender ID, message text, a seen status, and an optional image.
- Default values are provided for the 'seen' status and 'img' fields to ensure data integrity and consistency.
- The schema is equipped with automatic timestamp management to track creation and update times.
*/

// Import the Mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Define the schema for messages within a conversation application
const messageSchema = new mongoose.Schema(
	{
		// Define a field for the ID of the conversation this message is part of
		conversationId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId data type for MongoDB documents
			ref: "Conversation", // Reference the 'Conversation' model to establish a relationship
		},

		// Define a field for the ID of the user who sent the message
		sender: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId data type for MongoDB documents
			ref: "User", // Reference the 'User' model to establish a relationship
		},

		// Define a field for the text content of the message
		text: {
			type: String, // Use String type for text content of the message
		},

		// Define a boolean field to track whether the message has been seen by the recipient
		seen: {
			type: Boolean,
			default: false, // Set default as 'false' indicating the message is initially unseen
		},

		// Define an optional field for an image URL associated with the message
		img: {
			type: String,
			default: "", // Set default as an empty string, indicating no image is attached unless specified
		},
	},
	{
		// Enable automatic management of createdAt and updatedAt timestamps
		timestamps: true,
	}
);

// Create the Message model based on the defined schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model so it can be used in other parts of the application
export default Message;
