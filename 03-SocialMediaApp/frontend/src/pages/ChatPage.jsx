/*
- This code creates a chat page interface for a messaging application.
- It manages user conversations and provides functionality to search for users.
- It uses React hooks and Chakra UI components for the UI.
- Socket events are handled to update message status in real-time.
- It fetches and displays conversations from an API endpoint.
*/

import { SearchIcon } from "@chakra-ui/icons";
// Import Chakra UI components for building the user interface
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
// Import custom Conversation component to display individual conversations
import Conversation from "../components/Conversation";
// Import conversation icon from react-icons library
import { GiConversation } from "react-icons/gi";
// Import custom MessageContainer component to display messages within a conversation
import MessageContainer from "../components/MessageContainer";
// Import React hooks for managing state and side effects
import { useEffect, useState } from "react";
// Import custom hook to display toast notifications
import useShowToast from "../hooks/useShowToast";
// Import Recoil hooks for state management
import { useRecoilState, useRecoilValue } from "recoil";
// Import Recoil atoms for managing conversations and selected conversation state
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
// Import Recoil atom for managing user state
import userAtom from "../atoms/userAtom";
// Import custom hook to use socket context
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
	// State to handle user search status
	const [searchingUser, setSearchingUser] = useState(false);
	// State to handle loading status of conversations
	const [loadingConversations, setLoadingConversations] = useState(true);
	// State to store search text input
	const [searchText, setSearchText] = useState("");
	// State to manage selected conversation using Recoil
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	// State to manage list of conversations using Recoil
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	// Get the current user data from Recoil
	const currentUser = useRecoilValue(userAtom);
	// Hook to display toast messages
	const showToast = useShowToast();
	// Get socket and online users data from context
	const { socket, onlineUsers } = useSocket();

	// Effect to handle socket event for updating message seen status
	useEffect(() => {
		// Listen for "messagesSeen" event from the socket
		socket?.on("messagesSeen", ({ conversationId }) => {
			// Update the conversations state to mark messages as seen
			setConversations((prev) => {
				// Map through the previous conversations to find the updated conversation
				const updatedConversations = prev.map((conversation) => {
					// If the conversation ID matches, update the last message to seen
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					// Return the conversation unchanged if it does not match
					return conversation;
				});
				// Return the updated conversations array
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

	// Effect to fetch conversations on component mount
	useEffect(() => {
		// Define an asynchronous function to fetch conversations from the API
		const getConversations = async () => {
			try {
				// Make a fetch request to the API endpoint
				const res = await fetch("/api/messages/conversations");
				// Parse the JSON response
				const data = await res.json();
				// Check for errors in the response data
				if (data.error) {
					// Show an error toast notification
					showToast("Error", data.error, "error");
					return;
				}
				// Log the data to the console
				console.log(data);
				// Update the conversations state with the fetched data
				setConversations(data);
			} catch (error) {
				// Show an error toast notification if the fetch request fails
				showToast("Error", error.message, "error");
			} finally {
				// Set loadingConversations state to false after the fetch request completes
				setLoadingConversations(false);
			}
		};

		// Call the getConversations function
		getConversations();
	}, [showToast, setConversations]);

	// Function to handle search for a user and create/select a conversation
	const handleConversationSearch = async (e) => {
		// Prevent the default form submission behavior
		e.preventDefault();
		// Set searchingUser state to true
		setSearchingUser(true);
		try {
			// Make a fetch request to the API endpoint with the search text
			const res = await fetch(`/api/users/profile/${searchText}`);
			// Parse the JSON response
			const searchedUser = await res.json();
			// Check for errors in the response data
			if (searchedUser.error) {
				// Show an error toast notification
				showToast("Error", searchedUser.error, "error");
				return;
			}

			// Check if the searched user is the current user
			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				// Show an error toast notification if the user is trying to message themselves
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			// Check if a conversation with the searched user already exists
			const conversationAlreadyExists = conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id);

			// If the conversation already exists, select it
			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			// Create a mock conversation with the searched user
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
			// Add the mock conversation to the conversations state
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			// Show an error toast notification if the fetch request fails
			showToast("Error", error.message, "error");
		} finally {
			// Set searchingUser state to false after the fetch request completes
			setSearchingUser(false);
		}
	};

	// Return the JSX to render the chat page
	return (
		// Box component to position the chat page
		<Box position={"absolute"} left={"50%"} w={{ base: "100%", md: "80%", lg: "750px" }} p={4} transform={"translateX(-50%)"}>
			{/* Flex container for the chat interface */}
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				{/*  Flex container for the conversations list */}
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					{/*  Text component for the "Your Conversations" header */}
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					{/*  Form for searching conversations */}
					<form onSubmit={handleConversationSearch}>
						{/* Flex container for the search input and button */}
						<Flex alignItems={"center"} gap={2}>
							{/* Input component for search text */}
							<Input placeholder="Search for a user" onChange={(e) => setSearchText(e.target.value)} />
							{/* Button component for triggering the search */}
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>
					{/* Conditional rendering for loading skeletons */}
					{loadingConversations &&
						// Map through an array to render multiple loading skeletons
						[0, 1, 2, 3, 4].map((_, i) => (
							// Flex container for individual skeleton items
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								{/* Box for the skeleton circle */}
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								{/* Flex container for the skeleton lines */}
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}
					{/* Conditional rendering for conversation list */}
					{!loadingConversations &&
						// Map through the conversations array to render individual Conversation components
						conversations.map((conversation) => (
							// Conversation component for each conversation
							<Conversation key={conversation._id} isOnline={onlineUsers.includes(conversation.participants[0]._id)} conversation={conversation} />
						))}
				</Flex>
				{/* Conditional rendering for the selected conversation message container */}
				{!selectedConversation._id && (
					// Flex container for the placeholder when no conversation is selected
					<Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
						{/* {/* Conversation icon */}
						<GiConversation size={100} />
						{/* Text component for the placeholder message */}
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}
				{/* Conditional rendering for the MessageContainer component */}
				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

// Export the ChatPage component as the default export
export default ChatPage;
