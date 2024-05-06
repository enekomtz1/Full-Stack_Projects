/*
- This code defines a database schema for a messaging application using Mongoose.
- It focuses on structuring conversations between users by tracking participants and messages.
- Each conversation logs the participants involved and the last message exchanged.
- It automatically handles the creation and update timestamps for each conversation.
- The schema also ensures that the last message's visibility (seen or unseen) is tracked.
*/

// Importing the mongoose library to work with MongoDB
import mongoose from "mongoose";

// Define a schema for conversations between users in a messaging application using Mongoose
const conversationSchema = new mongoose.Schema(
	{
		// Array of participant IDs, referencing User documents
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId, // Using MongoDB ObjectID for referencing
				ref: "User", // Indicates that this ID refers to a document in the 'User' collection
			},
		],

		// Object containing information about the last message in the conversation
		lastMessage: {
			text: String, // The text content of the last message

			sender: {
				type: mongoose.Schema.Types.ObjectId, // Using MongoDB ObjectID to reference the sender's User document
				ref: "User", // Reference to the User model, indicating who sent the last message
			},

			seen: {
				type: Boolean, // Boolean flag to indicate if the last message was seen
				default: false, // Default value is false, indicating the message has not been seen
			},
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt timestamps for the conversation
	}
);

// Create the Conversation model using the defined schema
const Conversation = mongoose.model("Conversation", conversationSchema);

// Export the Conversation model so it can be used elsewhere in the application
export default Conversation;
