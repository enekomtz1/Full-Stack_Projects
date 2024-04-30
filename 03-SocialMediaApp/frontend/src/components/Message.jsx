/*
- This code defines a React component using Chakra UI for styling.
- It is designed to display messages in a chat application, differentiating between owned and received messages.
- The message can include text and/or an image, with special indicators for read status using icons.
- It uses Recoil for state management to access data on the current user and selected conversation.
- Conditional rendering and hooks like useState are used to handle image loading states.
*/

// Import UI components from Chakra UI necessary for building the layout and visual elements of the application
import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";

// Import the atom from Recoil for accessing the selected conversation's state throughout the application
import { selectedConversationAtom } from "../atoms/messagesAtom";

// Import the useRecoilValue hook from Recoil to subscribe to Recoil state and re-render components when it changes
import { useRecoilValue } from "recoil";

// Import the user-specific atom from the Recoil setup to manage and access user state
import userAtom from "../atoms/userAtom";

// Import specific icons from react-icons for displaying icons in the UI, enhancing user interaction feedback
import { BsCheck2All } from "react-icons/bs";

// Import the useState hook from React for managing state within the functional component
import { useState } from "react";

// Define the Message component with props for ownership of the message and the message data itself
const Message = ({ ownMessage, message }) => {
	// Retrieve the current state of the selected conversation using Recoil's useRecoilValue hook.
	// This hook subscribes the component to the selectedConversationAtom's value, causing it to re-render if the atom's value changes.
	const selectedConversation = useRecoilValue(selectedConversationAtom);

	// Similarly, retrieve the current user's state using the useRecoilValue hook linked to the userAtom.
	// It allows access to user-related data throughout the component, updating if the user's data changes globally.
	const user = useRecoilValue(userAtom);

	// Initialize the local state 'imgLoaded' using the useState hook to manage the loading status of images.
	// useState returns a pair: the current state value 'imgLoaded' and a function 'setImgLoaded' that updates it.
	// Initially, 'imgLoaded' is set to false, indicating that images are not yet loaded by default.
	const [imgLoaded, setImgLoaded] = useState(false);

	// Render the message
	return (
		<>
			{/* Conditional rendering based on message ownership */}
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
					{/* Check if message contains text and display it */}
					{message.text && (
						<Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
							<Text color={"white"}>{message.text}</Text>
							<Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}

					{/* Display skeleton image loader if image is not yet loaded */}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} hidden onLoad={() => setImgLoaded(true)} alt="Message image" borderRadius={4} />
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{/* Display the image once it is loaded */}
					{message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} alt="Message image" borderRadius={4} />
							<Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}

					{/* Display user avatar */}
					<Avatar src={user.profilePic} w="7" h={7} />
				</Flex>
			) : (
				<Flex gap={2}>
					{/* Display avatar of the other participant in the conversation */}
					<Avatar src={selectedConversation.userProfilePic} w="7" h={7} />

					{/* Display message text if present */}
					{message.text && (
						<Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
							{message.text}
						</Text>
					)}

					{/* Display skeleton loader for image if not loaded */}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} hidden onLoad={() => setImgLoaded(true)} alt="Message image" borderRadius={4} />
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{/* Display the image once loaded */}
					{message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} alt="Message image" borderRadius={4} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

// Export the Message component for use in other parts of the application
export default Message;
