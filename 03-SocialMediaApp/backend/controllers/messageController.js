/*
- This code provides backend functionality for messaging in a web application.
- It includes functions to send messages, retrieve messages, and list conversations.
- Real-time messaging is enabled via socket.io.
- Messages can include text and optionally an image, which is uploaded to Cloudinary.
- Error handling is incorporated to manage and respond to exceptions effectively.
*/

import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

async function sendMessage(req, res) {
	try {
		// Destructure recipient ID and message from the request body
		const { recipientId, message } = req.body;

		// Extract the image URL from the request body, if present
		let { img } = req.body;

		// Get the sender's ID from the user's authenticated session
		const senderId = req.user._id;

		// Search for a conversation between the sender and the recipient
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		// If no existing conversation is found, create a new one
		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save(); // Persist the new conversation to the database
		}

		// If an image is included in the message, upload it to Cloudinary
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url; // Update the image URL to the secured one provided by Cloudinary
		}

		// Create a new message object with the conversation ID, sender, text, and image
		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "", // Use the image URL if available, otherwise default to an empty string
		});

		// Save the new message and update the last message in the conversation atomically
		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		// Retrieve the socket ID of the recipient to enable real-time messaging
		const recipientSocketId = getRecipientSocketId(recipientId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit("newMessage", newMessage); // Emit the message event to the recipient's socket
		}

		// Send a successful response with the message data
		res.status(201).json(newMessage);
	} catch (error) {
		// In case of an error, respond with a 500 status code and the error message
		res.status(500).json({ error: error.message });
	}
}

async function getMessages(req, res) {
	// Extract the ID of the other participant from the request parameters.
	const { otherUserId } = req.params;

	// Retrieve the current user's ID from the request object.
	const userId = req.user._id;

	try {
		// Attempt to find a conversation that includes both the current user and the other user.
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		// If no conversation is found, return a 404 error with a message.
		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		// Retrieve all messages from the found conversation, sorted by creation time.
		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		// Return the messages with a 200 OK status.
		res.status(200).json(messages);
	} catch (error) {
		// Handle any errors during the process by returning a 500 server error status and the error message.
		res.status(500).json({ error: error.message });
	}
}

async function getConversations(req, res) {
	// Extracts the user ID from the request object.
	const userId = req.user._id;

	try {
		// Fetches all conversations where the user is a participant and populates participant details.
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// Filters out the current user from the participants array in each conversation.
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter((participant) => participant._id.toString() !== userId.toString());
		});

		// Sends the filtered conversations as a JSON response with status 200 (OK).
		res.status(200).json(conversations);
	} catch (error) {
		// Sends an error message as a JSON response with status 500 (Internal Server Error) if an error occurs.
		res.status(500).json({ error: error.message });
	}
}

export { sendMessage, getMessages, getConversations };
