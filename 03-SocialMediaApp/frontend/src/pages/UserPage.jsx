/*
- This code defines a React component named UserPage that manages user profiles and posts.
- It uses React hooks for state management and effects, and it integrates with a Recoil state atom.
- The component fetches user-specific posts from a server upon username changes or component mounting.
- It displays a loading spinner while fetching data and handles possible fetching errors with a toast notification.
- Depending on the data retrieved, it conditionally renders different UI elements.
*/

import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
	// Retrieves user data and loading state from a custom hook.
	const { user, loading } = useGetUserProfile();

	// Extracts the username from the URL parameters.
	const { username } = useParams();

	// Custom hook to display toast messages for feedback.
	const showToast = useShowToast();

	// State for managing the list of posts and fetching status.
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	useEffect(() => {
		// Function to fetch posts specific to the user.
		const getPosts = async () => {
			// Prevents fetching if no user data is available.
			if (!user) return;
			setFetchingPosts(true);
			try {
				// Fetches posts from server using the username.
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				console.log(data);
				setPosts(data);
			} catch (error) {
				// Displays error message on failure.
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				// Ensures that the fetching status is updated after the request.
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]); // Dependencies for the useEffect hook.

	// Renders a loading spinner if the user data is still being loaded.
	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	// Renders a message if no user data is found after loading.
	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<>
			<UserHeader user={user} />
			{/* Conditional rendering based on fetching status and presence of posts. */}
			{!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{/* Maps over the array of posts to render individual Post components. */}
			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</>
	);
};

export default UserPage;
