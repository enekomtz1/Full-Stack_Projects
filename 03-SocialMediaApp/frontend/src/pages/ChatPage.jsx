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

	// This useEffect hook is used for fetching conversation data asynchronously when the component mounts or when specified dependencies change.
	useEffect(() => {
		// Define an asynchronous function to fetch conversations.
		const getConversations = async () => {
			try {
				// Attempt to fetch conversations from the server.
				const res = await fetch("/api/messages/conversations");
				// Parse the JSON response.
				const data = await res.json();
				// Check for errors in the response and display an error message if present.
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// Log the received data for debugging purposes.
				console.log(data);
				// Update the component's state with the fetched conversations.
				setConversations(data);
			} catch (error) {
				// Handle any errors during the fetch operation.
				showToast("Error", error.message, "error");
			} finally {
				// Ensure that the loading state is updated regardless of the result.
				setLoadingConversations(false);
			}
		};

		// Execute the function to fetch conversations.
		getConversations();
	}, [showToast, setConversations]); // Dependencies for useEffect to control re-execution.

	const handleConversationSearch = async (e) => {
		// Prevent default form submission behavior
		e.preventDefault();

		// Set the searching state to true
		setSearchingUser(true);

		try {
			// Fetch the user profile based on the searchText
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();

			// Check if the API returned an error
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			// Check if the current user is trying to message themselves
			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			// Check if there is already an existing conversation with this user
			const conversationAlreadyExists = conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id);

			// If the conversation exists, select it
			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			// Create a mock conversation object
			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};

			// Update the conversations state with the new mock conversation
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			// Show an error message if there was a problem during the fetch
			showToast("Error", error.message, "error");
		} finally {
			// Set the searching state to false once the operation is complete
			setSearchingUser(false);
		}
	};
};
