import mongoose from "mongoose";

// Define a schema for conversations between users in a messaging application using Mongoose
const conversationSchema = new mongoose.Schema(
	{
		// Array of participant IDs, referencing User documents
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		// Information about the last message in the conversation
		lastMessage: {
			text: String, // The text content of the last message

			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", // Reference to the User model for who sent the last message
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
