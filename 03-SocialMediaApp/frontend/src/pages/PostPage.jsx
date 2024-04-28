// Chakra UI components for UI design
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
// Custom action components that include interactive buttons like edit and delete
import Actions from "../components/Actions";
// React hook for performing side effects in function components
import { useEffect } from "react";
// Custom comment component for displaying individual comments
import Comment from "../components/Comment";
// Hook for fetching user profile data
import useGetUserProfile from "../hooks/useGetUserProfile";
// Hook for displaying toast notifications
import useShowToast from "../hooks/useShowToast";
// Hooks from react-router-dom for navigation and accessing URL parameters
import { useNavigate, useParams } from "react-router-dom";
// Utility for formatting dates relative to the current time
import { formatDistanceToNow } from "date-fns";
// Recoil state management hooks for managing global state atomically
import { useRecoilState, useRecoilValue } from "recoil";
// Global state atom for user data
import userAtom from "../atoms/userAtom";
// Icon component for a delete action
import { DeleteIcon } from "@chakra-ui/icons";
// Global state atom for posts data
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
	// Fetch the user profile and loading state
	const { user, loading } = useGetUserProfile();

	// Retrieve and manage the posts state using Recoil
	const [posts, setPosts] = useRecoilState(postsAtom);

	// Function to show toast notifications
	const showToast = useShowToast();

	// Retrieve the current post ID from the URL parameters
	const { pid } = useParams();

	// Get the current user's state from Recoil
	const currentUser = useRecoilValue(userAtom);

	// Hook for programmatic navigation
	const navigate = useNavigate();

	// Extract the current post assuming the first post in the array is the current one
	const currentPost = posts[0];

	// This useEffect hook is used for handling the fetching of post data based on a post ID.
	useEffect(() => {
		// Define the async function to fetch post data
		const getPost = async () => {
			// Clear previous posts
			setPosts([]);

			try {
				// Attempt to fetch data from the server
				const res = await fetch(`/api/posts/${pid}`);
				// Convert the response into JSON
				const data = await res.json();

				// Check for errors in the response data
				if (data.error) {
					// Display an error toast if there is an error field
					showToast("Error", data.error, "error");
					return;
				}

				// Set the fetched data as the new post array
				setPosts([data]);
			} catch (error) {
				// Handle any errors during fetch or processing
				showToast("Error", error.message, "error");
			}
		};

		// Call the getPost function
		getPost();
	}, [showToast, pid, setPosts]); // Depend on showToast, pid, and setPosts to rerun

	const handleDeletePost = async () => {
		// Confirm with the user before deleting the post
		if (!window.confirm("Are you sure you want to delete this post?")) return;

		try {
			// Attempt to delete the post using the DELETE method
			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json(); // Parse the JSON response

			// Check if the server responded with an error
			if (data.error) {
				showToast("Error", data.error, "error"); // Show error message
				return;
			}

			showToast("Success", "Post deleted", "success"); // Show success message
			navigate(`/${user.username}`); // Navigate to the user's profile page
		} catch (error) {
			showToast("Error", error.message, "error"); // Show error message in case of an exception
		}
	};

	// Check for absence of user and presence of loading
	if (!user && loading) {
		// Return a Flex container centering the Spinner component
		return (
			<Flex justifyContent={"center"}>
				// Display an extra-large spinner to indicate loading process
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	// Check if there is no current post and return null if true
	if (!currentPost) return null;

	// Log the value of 'currentPost' to the console
	console.log("currentPost", currentPost);

	return (
		<>
			<Flex>
				{/* Main container for user profile and actions */}
				<Flex w={"full"} alignItems={"center"} gap={3}>
					{/* Avatar with user's profile picture */}
					<Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg" />

					{/* Container for username and verified badge */}
					<Flex>
						{/* Display username with bold styling */}
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						{/* Verified badge image */}
						<Image src="/verified.png" w="4" h={4} ml={4} />
					</Flex>
				</Flex>

				{/* Container for time since post and delete option */}
				<Flex gap={4} alignItems={"center"}>
					{/* Display time since post was created */}
					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{/* Delete icon shows only if current user is the post creator */}
					{currentUser?._id === user._id && <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />}
				</Flex>
			</Flex>

			<Text my={3}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>

			<Divider my={4} />
			{currentPost.replies.map((reply) => (
				<Comment key={reply._id} reply={reply} lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} />
			))}
		</>
	);
};
