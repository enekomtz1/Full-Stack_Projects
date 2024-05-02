/*
- This code defines a React component named 'Post' that displays social media post details.
- It uses Chakra UI for styling and React Router for navigation within a React application.
- The component fetches user details from a server and handles post deletion with confirmation.
- It conditionally renders user interactions and elements based on the data of the post, such as replies.
- Error handling and user feedback are managed through a custom toast notification hook.
*/

// Importing necessary modules and components from Chakra UI, React, and other libraries
import { Avatar, Box, Flex, Text, Image, DeleteIcon } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { formatDistanceToNow } from "date-fns";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

// The Post component definition accepting props
const Post = ({ post, postedBy }) => {
	// State for storing the user details
	const [user, setUser] = useState(null);

	// Custom hook to display toasts for notifications
	const showToast = useShowToast();

	// Accessing current user details from global state (Recoil)
	const currentUser = useRecoilValue(userAtom);

	// Recoil state management for posts
	const [posts, setPosts] = useRecoilState(postsAtom);

	// Hook to navigate programmatically in React Router
	const navigate = useNavigate();

	// Effect to load user data on component mount or when dependencies change
	useEffect(() => {
		// Define an asynchronous function 'getUser' to fetch user details from the server
		const getUser = async () => {
			try {
				// Attempt to fetch user details using the postedBy identifier
				const res = await fetch("/api/users/profile/" + postedBy);

				// Parse the JSON response
				const data = await res.json();

				// Check for any error returned by the server and show a toast notification if there is one
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// If no error, update the user state with the fetched data
				setUser(data);
			} catch (error) {
				// Handle any errors that occur during fetch operation
				showToast("Error", error.message, "error");

				// Set user state to null in case of error
				setUser(null);
			}
		};

		// Call the getUser function defined above
		getUser();

		// The useEffect hook will re-run this effect if 'postedBy' or 'showToast' changes.
	}, [postedBy, showToast]);

	// Function to handle the deletion of a post
	const handleDeletePost = async (e) => {
		// Prevents the default action of the event (useful in case this is triggered by a form submission)
		e.preventDefault();

		// Confirmation dialog to ensure the user wants to delete the post; exits if they do not confirm
		if (!window.confirm("Are you sure you want to delete this post?")) return;

		// Asynchronous request to the server to delete the post by its unique ID
		const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
		// Parsing the JSON response from the server
		const data = await res.json();

		// If the server returns an error, display a toast notification with the error message and stop execution
		if (data.error) {
			showToast("Error", data.error, "error");
			return;
		}

		// If deletion is successful, display a success toast
		showToast("Success", "Post deleted", "success");

		// Update the state to filter out the deleted post, effectively removing it from the UI
		setPosts(posts.filter((p) => p._id !== post._id));
	};

	// Render null if user data is not yet available
	if (!user) return null;

	// Component JSX structure for displaying the post
	return (
		/* Link wrapper for navigating to the specific post page */
		<Link to={`/${user.username}/post/${post._id}`}>
			{/* Main container with gaps, margin, and padding */}
			<Flex gap={3} mb={4} py={5}>
				{/* Column layout for user avatar and separator line */}
				<Flex flexDirection={"column"} alignItems={"center"}>
					{/* User avatar with click event to navigate to user profile */}
					<Avatar
						size="md"
						name={user.name}
						src={user?.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>

					{/* Vertical line separator */}
					<Box w="1px" h={"full"} bg="gray.light" my={2}></Box>

					{/* Container for showing post replies */}
					<Box position={"relative"} w={"full"}>
						{/* Displays emoji if no replies */}
						{post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}

						{/* First reply's avatar */}
						{post.replies[0] && <Avatar size="xs" name="John doe" src={post.replies[0].userProfilePic} position={"absolute"} top={"0px"} left="15px" padding={"2px"} />}

						{/* Second reply's avatar */}
						{post.replies[1] && <Avatar size="xs" name="John doe" src={post.replies[1].userProfilePic} position={"absolute"} bottom={"0px"} right="-5px" padding={"2px"} />}

						{/* Third reply's avatar */}
						{post.replies[2] && <Avatar size="xs" name="John doe" src={post.replies[2].userProfilePic} position={"absolute"} bottom={"0px"} left="4px" padding={"2px"} />}
					</Box>
				</Flex>
				{/* Flex container for post details and actions */}
				<Flex flex={1} flexDirection={"column"} gap={2}>
					{/* User and post info with delete option */}
					<Flex justifyContent={"space-between"} w={"full"}>
						{/* Username and verified icon */}
						<Flex w={"full"} alignItems={"center"}>
							<Text
								fontSize={"sm"}
								fontWeight={"bold"}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
							>
								{user?.username}
							</Text>
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>

						{/* Timestamp and delete icon conditionally shown */}
						<Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>

							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
						</Flex>
					</Flex>

					{/* Display post text */}
					<Text fontSize={"sm"}>{post.text}</Text>

					{/* Display post image if available */}
					{post.img && (
						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
							<Image src={post.img} w={"full"} />
						</Box>
					)}

					{/* Actions component with like and comment options */}
					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

// Exporting the Post component for use elsewhere
export default Post;
