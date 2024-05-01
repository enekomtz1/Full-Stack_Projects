/*
- This code implements a message input component for a chat application using React and Chakra UI.
- It includes text and image messaging functionalities with a preview modal for images.
- The component integrates state management using React's useState, useRef, and Recoil for global state.
- Error handling and user feedback are provided through custom hooks and conditional rendering.
- It connects to a backend API for sending messages and dynamically updates the conversation state.
*/

import {
	Flex, // Import Flex component for layout management.
	Image, // Import Image component for displaying images.
	Input, // Import Input component for user text input.
	InputGroup, // Import InputGroup for grouping inputs with elements like buttons.
	InputRightElement, // Import InputRightElement to place elements like buttons inside an input.
	Modal, // Import Modal for displaying modal dialogs.
	ModalBody, // Import ModalBody for content area of the modal.
	ModalCloseButton, // Import ModalCloseButton for a close button in modals.
	ModalContent, // Import ModalContent for the structure of the modal.
	ModalHeader, // Import ModalHeader for the header section of the modal.
	ModalOverlay, // Import ModalOverlay for the background overlay beneath the modal.
	Spinner, // Import Spinner for loading indicators.
	useDisclosure, // Import useDisclosure for controlling the visibility of modals.
} from "@chakra-ui/react";

// Importing components and hooks from Chakra UI for UI management.
import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";

// Importing useState and useRef from React for state management and references.
import { useRef, useState } from "react";

// Importing IoSendSharp icon from react-icons for the send button.
import { IoSendSharp } from "react-icons/io5";

// Custom hook for displaying toast notifications.
import useShowToast from "../hooks/useShowToast";

// Importing Recoil atoms for managing messages state.
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";

// Importing Recoil hooks for state management.
import { useRecoilValue, useSetRecoilState } from "recoil";

// Importing BsFillImageFill icon from react-icons for the image button.
import { BsFillImageFill } from "react-icons/bs";

// Custom hook for handling image preview.
import usePreviewImg from "../hooks/usePreviewImg";

// Component definition for MessageInput.
const MessageInput = ({ setMessages }) => {
	// State for the message text.
	const [messageText, setMessageText] = useState("");

	// Hook to show toast messages.
	const showToast = useShowToast();

	// Accessing the selected conversation's details from Recoil.
	const selectedConversation = useRecoilValue(selectedConversationAtom);

	// Hook to set the conversations state.
	const setConversations = useSetRecoilState(conversationsAtom);

	// Ref for the file input element.
	const imageRef = useRef(null);

	// Hook to control modal visibility.
	const { onClose } = useDisclosure();

	// Hooks to manage image uploading and previewing.
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

	// State to track if a message is currently being sent.
	const [isSending, setIsSending] = useState(false);

	// Handler for sending messages.
	const handleSendMessage = async (e) => {
		// Prevent default form submission behavior.
		e.preventDefault();

		// Do not proceed if there is nothing to send.
		if (!messageText && !imgUrl) return;

		// Prevent multiple submissions.
		if (isSending) return;

		// Indicate that the message is being sent.
		setIsSending(true);

		try {
			// Sending the message via API.
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					recipientId: selectedConversation.userId,
					img: imgUrl,
				}),
			});
			// Parsing the response to JSON.
			const data = await res.json();
			if (data.error) {
				// Displaying an error message if the API call was unsuccessful.
				showToast("Error", data.error, "error");
				return;
			}
			// Adding the new message to the messages state.
			setMessages((messages) => [...messages, data]);

			// Updating the global conversation state with the new message.
			setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
			// Resetting the message input fields.
			setMessageText("");
			setImgUrl("");
		} catch (error) {
			// Displaying an error message if there was an exception during the API call.
			showToast("Error", error.message, "error");
		} finally {
			// Resetting the sending state after the operation.
			setIsSending(false);
		}
	};

	// Component layout.
	return (
		<Flex gap={2} alignItems={"center"}>
			{/* Form for sending a message. Uses 95% of the flex space. */}
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
				{/* Input group that combines text input and send button. */}
				<InputGroup>
					{/* Text input for typing messages. Updates state on change. */}
					<Input w={"full"} placeholder="Type a message" onChange={(e) => setMessageText(e.target.value)} value={messageText} />
					{/* Send button on the right of the input. */}
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
			{/* Flex container for the image upload icon, takes up 5% of flex space. */}
			<Flex flex={5} cursor={"pointer"}>
				{/* Image icon which triggers file input click for image uploading. */}
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				{/* Hidden file input for image uploading. */}
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			{/* Modal that appears when there is an image URL. */}
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				{/* Overlay for modal background. */}
				<ModalOverlay />
				{/* Content container for the modal. */}
				<ModalContent>
					{/* Empty modal header, could be used for title if needed. */}
					<ModalHeader></ModalHeader>
					{/* Close button for the modal. */}
					<ModalCloseButton />
					{/* Body of the modal which includes the image preview and send option. */}
					<ModalBody>
						{/* Container for the image preview. */}
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						{/* Container for send button or spinner during sending. */}
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} /> : <Spinner size={"md"} />}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

// Exporting the MessageInput component.
export default MessageInput;
