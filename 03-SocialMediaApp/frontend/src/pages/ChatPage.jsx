/*
- This component handles the chat interface in an application.
- Utilizes Chakra UI for layout and styling.
- Manages state using React hooks and Recoil for global state.
- Communicates with a backend API to fetch and manage conversations.
- Handles live updates via WebSocket.
- Implements error handling and user feedback through toasts.
*/

import React, { useState, useEffect } from "react";
import { Box, Input, Button, useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { conversationsState } from "./state";
import { fetchConversations, sendMessage } from "./api";
import { useWebSocket } from "./hooks";

const ChatComponent = () => {
	// State to track if the user search is active
	const [searchingUser, setSearchingUser] = useState(false);

	// State to track if conversations are currently loading
	const [loadingConversations, setLoadingConversations] = useState(true);

	// State to manage the search text input
	const [searchText, setSearchText] = useState("");

	// Recoil state for managing the currently selected conversation
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

	// Recoil state for managing the list of conversations
	const [conversations, setConversations] = useRecoilState(conversationsAtom);

	// Retrieve the current user details from Recoil
	const currentUser = useRecoilValue(userAtom);

	// Custom hook for showing toast notifications
	const showToast = useShowToast();

	// Custom hook to retrieve socket instance and list of online users
	const { socket, onlineUsers } = useSocket();

	// This useEffect hook is used for setting up a socket listener
	useEffect(() => {
		// Check if socket exists and then set up a listener for "messagesSeen" events
		socket?.on("messagesSeen", ({ conversationId }) => {
			// The listener updates the state of conversations when a message is seen
			setConversations((prev) => {
				// Map through previous conversations to find and update the relevant one
				const updatedConversations = prev.map((conversation) => {
					// Check if current conversation is the one that should be updated
					if (conversation._id === conversationId) {
						// Return a new conversation object with the last message marked as seen
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					// Return the conversation unchanged if it is not the one updated
					return conversation;
				});
				// Return the new array of conversations with the updated one
				return updatedConversations;
			});
		});
		// Specify dependencies for this effect: it reruns when socket or setConversations changes
	}, [socket, setConversations]);
};
