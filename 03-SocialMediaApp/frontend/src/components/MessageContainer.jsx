/*
- This code defines a React component named MessageContainer that handles the messaging UI.
- It uses the Chakra UI for styling, Recoil for state management, and Socket.IO for real-time communications.
- The component shows messages in a conversation and updates the UI in response to new messages or changes.
- Sounds are played for new messages when the app is not in focus, enhancing user interaction.
- Error handling and state updates ensure the application remains responsive and current with the latest message data.
*/

import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
	// Retrieves a toast function to show notifications to the user
	const showToast = useShowToast();

	// Retrieves the currently selected conversation's data from Recoil global state
	const selectedConversation = useRecoilValue(selectedConversationAtom);

	// Initializes and sets the loading state for messages with a default value of true
	const [loadingMessages, setLoadingMessages] = useState(true);

	// Initializes and manages the state for messages within the conversation as an empty array
	const [messages, setMessages] = useState([]);

	// Retrieves the current user's data from the Recoil global state
	const currentUser = useRecoilValue(userAtom);

	// Retrieves the socket object from the SocketContext which is used for real-time communication
	const { socket } = useSocket();

	// Retrieves a setter function from Recoil to update the conversations state
	const setConversations = useSetRecoilState(conversationsAtom);

	// Creates a ref object to manage the scrolling behavior of the message container
	const messageEndRef = useRef(null);

	// This useEffect hook sets up listeners for new messages over a WebSocket connection.
	useEffect(() => {
		// Listen for 'newMessage' events emitted by the server via sockets.
		socket.on("newMessage", (message) => {
			// Check if the message belongs to the currently selected conversation
			if (selectedConversation._id === message.conversationId) {
				// If it does, update the local state to include the new message at the end of the messages array
				setMessages((prev) => [...prev, message]);
			}

			// If the browser tab or window is not currently focused, play a notification sound
			if (!document.hasFocus()) {
				// Create a new audio object from the message sound file
				const sound = new Audio(messageSound);

				// Play the sound to notify the user
				sound.play();
			}

			// Update the global conversations state with new last message details
			setConversations((prev) => {
				// Map through existing conversations to find the one that matches the conversation ID of the new message
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === message.conversationId) {
						// If a match is found, return a new conversation object with updated last message details
						return {
							...conversation,
							lastMessage: {
								// Text of the last message
								text: message.text,

								// Sender ID of the last message
								sender: message.sender,
							},
						};
					}
					// For all other conversations, return them unchanged
					return conversation;
				});
				return updatedConversations;
			});
		});

		// Define a cleanup function that removes the 'newMessage' event listener when the component unmounts or dependencies change
		return () => socket.off("newMessage");
	}, [socket, selectedConversation, setConversations]); // List of dependencies for the useEffect hook

	// This useEffect hook handles two main functionalities: emitting an event to mark messages as seen and listening for a "messagesSeen" event.
	useEffect(() => {
		// Check if the last message is from another user to determine if it should be marked as seen.
		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;

		// If the last message is from another user, emit "markMessagesAsSeen" to notify the server.
		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		// Listen for the "messagesSeen" event which updates the message status to seen.
		socket.on("messagesSeen", ({ conversationId }) => {
			// Check if the event pertains to the current selected conversation.
			if (selectedConversation._id === conversationId) {
				// Update the messages array to mark relevant messages as seen.
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						// Update the 'seen' status of messages that haven't been marked as seen yet.
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});

		// Cleanup function to remove the event listener when the component or dependencies change.
		return () => {
			socket.off("messagesSeen");
		};
	}, [socket, currentUser._id, messages, selectedConversation]); // List of dependencies for which the effect reruns.

	// This useEffect hook is used to ensure that whenever the 'messages' array updates, the view automatically scrolls to the latest message.
	// It utilizes the 'messageEndRef' reference attached to the last message element in the list.
	// The scroll behavior is set to 'smooth', which provides a smooth scrolling animation, enhancing the user experience by showing the transition.
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]); // Dependency array with 'messages' to trigger the effect only when messages update.

	// This useEffect hook is responsible for fetching messages for a selected conversation when the component mounts or when dependencies change.
	useEffect(() => {
		// Define an asynchronous function to fetch messages.
		const getMessages = async () => {
			// Start loading state and clear any existing messages.
			setLoadingMessages(true);
			setMessages([]);

			try {
				// Exit the function early if the conversation is a mock (possibly for testing or placeholder).
				if (selectedConversation.mock) return;

				// Fetch messages from the server for the current user's selected conversation.
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);

				// Parse the JSON response from the server.
				const data = await res.json();

				// Check if there was an error in the fetched data and show an error message if so.
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				// Set the fetched messages to the local state if no error occurred.
				setMessages(data);
			} catch (error) {
				// Handle any errors during the fetch operation and show an error message.
				showToast("Error", error.message, "error");
			} finally {
				// Ensure the loading state is set to false after fetching is complete, whether successful or not.
				setLoadingMessages(false);
			}
		};

		// Call the getMessages function to execute the fetching process.
		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]); // Dependency array to control the re-execution of the hook.

	return (
		<Flex flex="70" bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"} p={2} flexDirection={"column"}>
			{/* This Flex container acts as the main layout for the message section, with a background color that adapts to the color mode (light or dark). */}
			<Flex w={"full"} h={12} alignItems={"center"} gap={2}>
				{/* Display the user's avatar and username at the top of the message container. Also shows a verified icon next to the username if applicable. */}
				<Avatar src={selectedConversation.userProfilePic} size={"sm"} />
				<Text display={"flex"} alignItems={"center"}>
					{selectedConversation.username} <Image src="/verified.png" w={4} h={4} ml={1} />
				</Text>
			</Flex>

			{/* A visual divider to separate the header from the message content. */}
			<Divider />
			<Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
				{/* A conditional rendering block that displays loading skeletons if messages are still loading, otherwise it displays the actual messages. */}
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}>
							{/* Skeleton loaders for messages, alternating alignment based on whether the index is odd or even. */}
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h="8px" w="250px" />
								<Skeleton h="8px" w="250px" />
								<Skeleton h="8px" w="250px" />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message) => (
						<Flex key={message._id} direction={"column"} ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}>
							{/* For each message, display the message component and assign the 'messageEndRef' ref to the last message for automatic scrolling. */}
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
			</Flex>
			{/* A component for sending new messages. It also updates the messages state when a new message is sent. */}
			<MessageInput setMessages={setMessages} />
		</Flex>
	);
};

export default MessageContainer;
