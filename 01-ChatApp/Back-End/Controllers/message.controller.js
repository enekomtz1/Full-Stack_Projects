// message.controller.js is responsible for handling message-related operations
// in the chat application. It supports sending messages between users and
// retrieving the message history of a conversation.

import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

// Function to send a message from one user to another
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body; // Extract message text from request body
        const { id: receiverId } = req.params; // Extract receiver ID from URL parameters
        const senderId = req.user._id; // Sender ID from authenticated user

        // Look for an existing conversation between the sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no existing conversation, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message document
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Add message ID to conversation's messages array
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save conversation and message documents in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // Using Socket.io to emit the new message to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // Emit the message to the specific client
        }

        // Respond with the new message object
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to retrieve all messages in a conversation between two users
export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // Extract the other user's ID from URL parameters
        const senderId = req.user._id; // Sender ID from authenticated user

        // Find the conversation between the two users
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // Populate the messages array to return the message details

        // If no conversation is found, return an empty array
        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages; // Extract messages from the conversation

        // Respond with the array of messages
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
