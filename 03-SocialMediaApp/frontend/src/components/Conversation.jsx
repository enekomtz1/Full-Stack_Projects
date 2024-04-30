/*
- This code defines a React component named `Conversation` that displays a conversation interface.
- It uses Chakra UI for styling and layout, enhancing the user interface visually and functionally.
- Recoil is used for state management, specifically to handle the current and selected conversations.
- The component handles user interactions, like clicking on a conversation to select it.
- It visually indicates the current conversation, message status, and whether the user is online.
*/

// Import necessary UI components from Chakra UI and icons from React Icons
import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

// Define the Conversation component
const Conversation = ({ conversation, isOnline }) => {
	// Extract the first participant as 'user' from the conversation object
	const user = conversation.participants[0];
	// Retrieve the current user's details using Recoil
	const currentUser = useRecoilValue(userAtom);
	// Extract the last message from the conversation
	const lastMessage = conversation.lastMessage;
	// Recoil state hook for managing selected conversation state
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	// Hook to determine the current color mode (dark or light)
	const colorMode = useColorMode();

	// Debugging log to console
	console.log("selectedConverstion", selectedConversation);

	// Return the UI component structure
	return (
		<Flex
			gap={4} // Spacing between child elements
			alignItems={"center"} // Align items in the center vertically
			p={"1"} // Padding inside the Flex container
			_hover={{
				// Styling for hover state
				cursor: "pointer",
				bg: useColorModeValue("gray.600", "gray.dark"), // Background color changes with color mode
				color: "white", // Text color on hover
			}}
			onClick={() =>
				// Set the selected conversation on click
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					userProfilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			bg={
				// Background color depends on whether it is the selected conversation
				selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark") : ""
			}
			borderRadius={"md"} // Rounded corners for the container
		>
			<WrapItem>
				<Avatar
					size={{
						// Responsive avatar size
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic} // Source of the user's avatar image
				>
					{isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""} {/* Show green badge if online */}
				</Avatar>
			</WrapItem>

			<Stack direction={"column"} fontSize={"sm"}>
				{/* Vertical stack for text elements */}
				<Text fontWeight="700" display={"flex"} alignItems={"center"}>
					{user.username} <Image src="/verified.png" w={4} h={4} ml={1} /> {/* Username with a verified badge */}
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
					{currentUser._id === lastMessage.sender ? ( // Check if the current user sent the last message
						<Box color={lastMessage.seen ? "blue.400" : ""}>
							{/* Change color if the message was seen */}
							<BsCheck2All size={16} /> {/*  Display double check icon */}
						</Box>
					) : (
						""
					)}
					{lastMessage.text.length > 18 // Truncate long messages
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
					{/* Show image icon if no text */}
				</Text>
			</Stack>
		</Flex>
	);
};

// Export the Conversation component as a default export
export default Conversation;
