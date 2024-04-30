/*
- This code implements a React component to create and post user-generated content.
- It integrates hooks for managing state, interactions, and side-effects within a modal UI.
- The component uses Chakra UI for styling and layout, providing a responsive modal for creating posts.
- It uses Recoil for state management to maintain and update user and posts data.
- It handles image uploads with a preview and imposes a character limit on the text input.
*/

// Importing required modules and components from Chakra UI, React, Recoil, and custom hooks
import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

// Setting a constant for maximum character limit
const MAX_CHAR = 500;

// Define the CreatePost component
const CreatePost = () => {
	// Hook to control the open/close state of a modal dialog, with destructured methods and state.
	const { isOpen, onOpen, onClose } = useDisclosure();

	// State for managing the text of a post with a function to update it.
	const [postText, setPostText] = useState("");

	// Custom hook to handle image upload changes and state.
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

	// Reference to the hidden file input element for uploading images.
	const imageRef = useRef(null);

	// State to track the number of remaining characters allowed in the post text.
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);

	// Fetch the current user's details from the global state managed by Recoil.
	const user = useRecoilValue(userAtom);

	// Custom hook for showing toast notifications.
	const showToast = useShowToast();

	// State to manage the loading status of the post creation process.
	const [loading, setLoading] = useState(false);

	// Recoil state for managing the list of posts and a function to update them.
	const [posts, setPosts] = useRecoilState(postsAtom);

	// Retrieve the username from the URL parameters to possibly use in the component.
	const { username } = useParams();

	// Handle changes in text input
	const handleTextChange = (e) => {
		// Retrieve the text entered by the user from the event object
		const inputText = e.target.value;

		// Check if the input text length exceeds the maximum character limit
		if (inputText.length > MAX_CHAR) {
			// If it does, truncate the text to the maximum allowed length
			const truncatedText = inputText.slice(0, MAX_CHAR);

			// Update the post text state to the truncated text
			setPostText(truncatedText);

			// Set the remaining character count to zero since the maximum length is reached
			setRemainingChar(0);
		} else {
			// If the input text is within the limit, update the post text state to the current input
			setPostText(inputText);

			// Calculate and update the remaining characters allowed
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	};

	// Function to handle the creation of a post when the user submits the form
	const handleCreatePost = async () => {
		// Set loading state to true to show loading indicator on the button
		setLoading(true);
		try {
			// Perform a POST request to the server's create post API endpoint
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Specify that we are sending JSON data
				},
				body: JSON.stringify({
					postedBy: user._id, // Send the ID of the user who is creating the post
					text: postText, // Send the text content of the post
					img: imgUrl, // Send the image URL if any
				}),
			});

			// Parse the JSON response from the server
			const data = await res.json();

			// Check if the server response contains an error
			if (data.error) {
				// If there is an error, show a toast notification with the error message
				showToast("Error", data.error, "error");
				return;
			}

			// If the post is created successfully, show a success notification
			showToast("Success", "Post created successfully", "success");

			// Update the posts state to include the new post if the current user is the same as the logged-in user
			if (username === user.username) {
				setPosts([data, ...posts]);
			}

			// Close the modal after successful post creation
			onClose();

			// Reset the post text and image URL to prepare for another post
			setPostText("");
			setImgUrl("");
		} catch (error) {
			// If there is an error in the fetch operation, show a toast notification with the error message
			showToast("Error", error, "error");
		} finally {
			// Set loading state to false to hide the loading indicator
			setLoading(false);
		}
	};

	// Component JSX structure for rendering
	return (
		<>
			{/* Button to trigger the modal for creating a new post */}
			<Button position={"fixed"} bottom={10} right={5} bg={useColorModeValue("gray.300", "gray.dark")} onClick={onOpen} size={{ base: "sm", sm: "md" }}>
				<AddIcon />
			</Button>

			{/* Modal component that displays the form to create a new post */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />

					<ModalBody pb={6}>
						{/* Form control containing text input and image upload */}
						<FormControl>
							{/* Textarea for post content input */}
							<Textarea placeholder="Post content goes here.." onChange={handleTextChange} value={postText} />

							{/* Text showing remaining characters */}
							<Text fontSize="xs" fontWeight="bold" textAlign={"right"} m={"1"} color={"gray.800"}>
								{remainingChar}/{MAX_CHAR}
							</Text>

							{/* Hidden file input for image upload */}
							<Input type="file" hidden ref={imageRef} onChange={handleImageChange} />

							{/* Icon for triggering image upload */}
							<BsFillImageFill style={{ marginLeft: "5px", cursor: "pointer" }} size={16} onClick={() => imageRef.current.click()} />
						</FormControl>

						{/* Conditional rendering of image preview */}
						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt="Selected img" />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						{/* Button to submit the new post */}
						<Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

// Export the component
export default CreatePost;
