/*
- The HomePage component retrieves and displays posts from an API.
- It shows a loading spinner while the posts are being fetched.
- Errors during fetch are handled and displayed using a toast.
- Responsive design hides SuggestedUsers on smaller screens.
- Displays a message to follow users if no posts are available.
*/

import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	// State management for posts using Recoil
	const [posts, setPosts] = useRecoilState(postsAtom);

	// State to manage the loading status
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		// Function to fetch posts from the server
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				// Fetching data from the server
				const res = await fetch("/api/posts/feed");
				const data = await res.json();

				// Handle potential errors in the response
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				// Handle exceptions during fetching
				showToast("Error", error.message, "error");
			} finally {
				// Reset loading state regardless of outcome
				setLoading(false);
			}
		};

		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap="10" alignItems={"flex-start"}>
			<Box flex={70}>
				{/* Display message if not loading and no posts */}
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

				{/* Show spinner while loading */}
				{loading && (
					<Flex justify="center">
						<Spinner size="xl" />
					</Flex>
				)}

				{/* Map posts to Post components */}
				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;
