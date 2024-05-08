/*
- This code provides backend functionality for messaging in a web application.
- It includes functions to send messages, retrieve messages, and list conversations.
- Real-time messaging is enabled via socket.io.
- Messages can include text and optionally an image, which is uploaded to Cloudinary.
- Error handling is incorporated to manage and respond to exceptions effectively.
*/

// Import necessary models and utilities
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

// Function to send a message between users
async function sendMessage(req, res) {
	try {
		// Destructure necessary data from the request body
		const { recipientId, message } = req.body;

		// Optional: Extract the image URL from the request if provided
		let { img } = req.body;

		// Retrieve the sender's ID from the authenticated session
		const senderId = req.user._id;

		// Check for an existing conversation or create a new one
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		// Create a new conversation if one does not exist
		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save(); // Save the new conversation to the database
		}

		// If an image is included, upload it to Cloudinary and get a secured URL
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url; // Update image URL to the secure one
		}

		// Create a new message object with all relevant information
		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "", // Include image URL if available, otherwise default to empty
		});

		// Save the message and update the conversation atomically
		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		// Emit the new message to the recipient using their socket ID
		const recipientSocketId = getRecipientSocketId(recipientId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit("newMessage", newMessage);
		}

		// Respond with the newly created message
		res.status(201).json(newMessage);
	} catch (error) {
		// Handle any errors with a server error response
		res.status(500).json({ error: error.message });
	}
}

// Function to retrieve messages from a specific conversation
async function getMessages(req, res) {
	// Retrieve other participant's ID and user's ID from the request
	const { otherUserId } = req.params;
	const userId = req.user._id;

	try {
		// Find a conversation involving both users
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		// If no conversation exists, return a not found error
		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		// Retrieve and sort all messages in the conversation by creation time
		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		// Return the messages to the client
		res.status(200).json(messages);
	} catch (error) {
		// Respond with an error in case of failure
		res.status(500).json({ error: error.message });
	}
}

// Function to list all conversations of a user
async function getConversations(req, res) {
	// Get user ID from the authenticated session
	const userId = req.user._id;

	try {
		// Fetch all conversations involving the user and populate participant details
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// Filter out the current user from the participants list
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter((participant) => participant._id.toString() !== userId.toString());
		});

		// Send filtered conversations back to the user
		res.status(200).json(conversations);
	} catch (error) {
		// Handle errors by sending an internal server error response
		res.status(500).json({ error: error.message });
	}
}

// Export all functions for use in other parts of the application
export { sendMessage, getMessages, getConversations };
