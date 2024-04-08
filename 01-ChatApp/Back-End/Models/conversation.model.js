/*
Mongoose schema and model for a conversation in a chat application.
*/

import mongoose from "mongoose"; // Import mongoose to interact with MongoDB

// Define the schema for a conversation
const conversationSchema = new mongoose.Schema(
	{
		// Array of participant user IDs, referencing the User model
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId, // MongoDB Object ID type
				ref: "User", // Reference to the User model for relational data
			},
		],
		// Array of message IDs that are part of the conversation, referencing the Message model
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId, // MongoDB Object ID type
				ref: "Message", // Reference to the Message model for relational data
				default: [], // Default value is an empty array
			},
		],
	},
	{ timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the Conversation model from the schema
const Conversation = mongoose.model("Conversation", conversationSchema);

// Export the Conversation model for use in other parts of the application
export default Conversation;
