import mongoose from "mongoose";

// Define a schema for messages in a conversation application using Mongoose
const messageSchema = new mongoose.Schema(
	{
		// The ID of the conversation this message belongs to, referencing the Conversation model
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
		},

		// The ID of the user who sent the message, referencing the User model
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		// The text content of the message
		text: String,

		// Boolean flag to track whether the message has been seen by the recipient
		seen: {
			type: Boolean,
			default: false, // By default, the message is not seen
		},

		// Optional image URL associated with the message, if any
		img: {
			type: String,
			default: "", // Default is an empty string, indicating no image is attached
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt timestamps for each message
	}
);

// Create the Message model using the defined schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model so it can be used elsewhere in the application
export default Message;
