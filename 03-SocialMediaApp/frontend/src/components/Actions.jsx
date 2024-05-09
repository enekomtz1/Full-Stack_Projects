/*
- This code defines a React component named Actions which enables interaction with a post.
- It allows users to like or unlike a post, and to reply to it.
- The component utilizes Recoil for global state management to access user and posts information.
- It leverages the Chakra UI library for modal and button elements to provide a responsive UI.
- Error handling and user feedback are managed through custom toast notifications and conditional rendering.
*/

import { Box, Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";

const Actions = ({ post }) => {
	// Use Recoil to fetch the current user object from a global state atom
	const user = useRecoilValue(userAtom);

	// State to track if the current user has liked the post, initialized based on whether the user's ID is in the post's likes array
	const [liked, setLiked] = useState(post.likes.includes(user?._id));

	// Recoil state hook to manage and update the list of posts
	const [posts, setPosts] = useRecoilState(postsAtom);

	// State to indicate the process of liking a post to prevent duplicate actions
	const [isLiking, setIsLiking] = useState(false);

	// State to manage whether the user is currently replying to a post
	const [isReplying, setIsReplying] = useState(false);

	// State for holding the current text in the reply input field
	const [reply, setReply] = useState("");

	// Custom hook for showing toast notifications
	const showToast = useShowToast();

	// Hook from a UI library (e.g., Chakra UI) to handle opening and closing modal dialogs
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Define an asynchronous function to handle like and unlike actions
	const handleLikeAndUnlike = async () => {
		// Check if a user is logged in; if not, show an error toast and exit the function
		if (!user) return showToast("Error", "You must be logged in to like a post", "error");

		// Prevent multiple like requests by checking if a like operation is already in progress
		if (isLiking) return;

		// Set the isLiking flag to true to indicate that a like operation is in progress
		setIsLiking(true);

		try {
			// Perform a PUT request to the server to toggle the like status of the post
			const res = await fetch("/api/posts/like/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Parse the JSON response from the server
			const data = await res.json();

			// If the server returns an error, show an error toast and exit the function
			if (data.error) return showToast("Error", data.error, "error");

			// Conditionally update the posts array based on whether the post was previously liked or not
			if (!liked) {
				// If the post was not liked, add the current user's ID to the likes array
				const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: [...p.likes, user._id] };
					}
					return p;
				});
				setPosts(updatedPosts);
			} else {
				// If the post was liked, remove the current user's ID from the likes array
				const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: p.likes.filter((id) => id !== user._id) };
					}
					return p;
				});
				setPosts(updatedPosts);
			}

			// Toggle the liked state of the post
			setLiked(!liked);
		} catch (error) {
			// If an error occurs during the fetch operation, show an error toast
			showToast("Error", error.message, "error");
		} finally {
			// Set the isLiking flag to false to indicate that the like operation is complete
			setIsLiking(false);
		}
	};

	// Define an asynchronous function to handle the process of replying to a post
	const handleReply = async () => {
		// Check if the user is not logged in; if not, show an error toast and exit the function
		if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");

		// Check if a reply is already being processed; if so, exit the function to avoid duplicate submissions
		if (isReplying) return;

		// Set the isReplying flag to true to indicate that a reply is being processed
		setIsReplying(true);

		// Attempt to send the reply to the server
		try {
			// Construct the request to the server endpoint with the post ID
			const res = await fetch("/api/posts/reply/" + post._id, {
				method: "PUT", // Method type: PUT to update the server resource
				headers: {
					"Content-Type": "application/json", // Set content type of the request body
				},
				body: JSON.stringify({ text: reply }), // Convert the reply object to a JSON string
			});

			// Parse the JSON response from the server
			const data = await res.json();

			// Check for any errors returned from the server and display an error toast if any
			if (data.error) return showToast("Error", data.error, "error");

			// Update the local posts array with the new reply
			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [...p.replies, data] }; // Append the new reply to the current post
				}
				return p;
			});

			// Update the state with the new list of posts
			setPosts(updatedPosts);

			// Display a success toast message
			showToast("Success", "Reply posted successfully", "success");

			// Close the reply modal or reset relevant state
			onClose();

			// Clear the reply input field
			setReply("");
		} catch (error) {
			// Catch any errors during the fetch operation
			showToast("Error", error.message, "error");
		} finally {
			// Finally, reset the isReplying flag whether or not the operation was successful
			setIsReplying(false);
		}
	};

	// Main layout container using Flexbox for vertical orientation
	return (
		<Flex flexDirection="column">
			{/* Nested Flex container for the post icons with a gap and margin */}
			<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				{/* SVG for the "Like" button, which changes color and fill based on whether the post is liked */}
				<svg
					aria-label="Like"
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height="19"
					role="img"
					viewBox="0 0 24 22"
					width="20"
					onClick={handleLikeAndUnlike}
				>
					<path
						d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
						stroke="currentColor"
						strokeWidth="2"
					></path>
				</svg>

				{/* SVG for the "Comment" button, which triggers a modal for replies */}
				<svg aria-label="Comment" color="" fill="" height="20" role="img" viewBox="0 0 24 24" width="20" onClick={onOpen}>
					<title>Comment</title>
					<path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
				</svg>

				{/* Additional SVG icons for reposting and sharing */}
				<RepostSVG />
				<ShareSVG />
			</Flex>

			{/* Flex container for displaying the count of replies and likes */}
			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize="sm">
					{post.replies.length} replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize="sm">
					{post.likes.length} likes
				</Text>
			</Flex>

			{/* Modal for commenting */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						{/* Form control for entering a reply */}
						<FormControl>
							<Input placeholder="Reply goes here.." value={reply} onChange={(e) => setReply(e.target.value)} />
						</FormControl>
					</ModalBody>

					{/* Footer of the modal with a button to submit the reply */}
					<ModalFooter>
						<Button colorScheme="blue" size={"sm"} mr={3} isLoading={isReplying} onClick={handleReply}>
							Reply
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default Actions;

// Define the RepostSVG functional component
const RepostSVG = () => {
	return (
		// Return the SVG element
		<svg
			// Set accessibility label
			aria-label="Repost"
			// Use the current text color for the SVG stroke and fill
			color="currentColor"
			fill="currentColor"
			// Set fixed height and width
			height="20"
			// Define the role of the SVG for accessibility
			role="img"
			// Set the viewport of the SVG to enable scaling
			viewBox="0 0 24 24"
			// Set fixed width
			width="20"
		>
			{/* Title tag for descriptive text of the SVG */}
			<title>Repost</title>

			{/* Path element describing the shape of the repost icon */}
			<path
				// Ensure the fill attribute is cleared
				fill=""
				// Define the d attribute for the path geometry
				d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
			></path>
		</svg>
	);
};

// Define the ShareSVG functional component
const ShareSVG = () => {
	return (
		// Render an SVG element
		<svg
			aria-label="Share" // Accessibility label to describe the icon's function
			color="" // Color property, left empty for potential dynamic styling
			fill="rgb(243, 245, 247)" // Background fill color of the SVG
			height="20" // Height of the SVG in pixels
			role="img" // ARIA role specifying the semantic meaning of the SVG as an image
			viewBox="0 0 24 24" // Defines the area of view for the SVG
			width="20" // Width of the SVG in pixels
		>
			<title>Share</title> // Title for the SVG providing additional description
			<line
				fill="none" // Specifies that the line should not be filled
				stroke="currentColor" // Color of the line is the current text color
				strokeLinejoin="round" // Defines how the corners of the stroke line should be joined
				strokeWidth="2" // Width of the stroke line
				x1="22"
				x2="9.218" // Start and end x-coordinates of the line
				y1="3"
				y2="10.083" // Start and end y-coordinates of the line
			></line>
			<polygon
				fill="none" // Specifies that the polygon should not be filled
				points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" // Coordinates of the polygon vertices
				stroke="currentColor" // Color of the polygon's stroke is the current text color
				strokeLinejoin="round" // Defines how the corners of the stroke line should be joined
				strokeWidth="2" // Width of the stroke line
			></polygon>
		</svg>
	);
};
